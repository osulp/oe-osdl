import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { SearchCmpComponent } from './search-cmp/search-cmp.component';
import { ResultsCmpComponent } from './results-cmp/results-cmp.component';
import { OsdlSolrSrvService, ResultsStoreSrvService, SearchStateSrvService, GetMapServicesMetadataSrvService } from '../services/index';
import { UtilitiesCls } from '../utilities-cls';

declare var $: any;

@Component({
  selector: 'app-home-cmp',
  templateUrl: './home-cmp.component.html',
  styleUrls: ['./home-cmp.component.css']
})
export class HomeCmpComponent implements OnInit {
  solr_results: any;

  @ViewChild(ResultsCmpComponent) resultsCmp: ResultsCmpComponent;
  @ViewChild(SearchCmpComponent) searchCmp: SearchCmpComponent;

  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService,
    public _search_state_service: SearchStateSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private location: PlatformLocation,
    private _utilities: UtilitiesCls,
    private getServiceMetadata: GetMapServicesMetadataSrvService
  ) {
    location.onPopState((test: any) => {
      // console.log('popping', test, this.route.snapshot.params);
      this.checkQueryStingParams(true);
    });
  }

  onTextFilterChangeHandler(filter: any) {
    // console.log('filter',filter);
    try{
      this.resultsCmp.facetsCmp.setSelectedFacets([filter], 'textquery', true);
    } catch(ex){
      console.log(ex);
    }

  }

  checkQueryStingParams(updateFromPop?: boolean) {
    try{
      const params = [];
      let sortParam = '';
      // tslint:disable-next-line:forin
      for (const param in this.route.snapshot.params) {
        const paramVal = this.route.snapshot.params[param];
        if (param === 'fq') {
          paramVal.split(',').forEach(p => {
            params.push(
              {
                key: param,
                value: p.includes('*ramework') ? p + ' OR title:*ramework' : p,
                facet: p,
                query: p,
                selected: true,
                type: p.includes('*ramework')
                  ? 'framework'
                  : 'query'
              });
          });
        } else {
          sortParam = param === 'sort' ? paramVal : sortParam;
          params.push(
            {
              key: param,
              value: paramVal,
              facet: paramVal,
              query: paramVal,
              selected: true,
              type: paramVal.includes('*ramework')
                ? 'framework'
                : param === 'fq'
                  ? 'query'
                  : param === 'q'
                    ? 'textquery'
                    : param === 'sort'
                      ? 'sort' : 'facet'
            });
        }
      }

      if (this._search_state_service.getState() === undefined) {
        this._osdl_solr_service.setBaseSearchState();
      }
      const scope = this;
      if (params.length > 0) {
        this.resultsCmp.facetsCmp.setSelectedFacets(params, 'framework', updateFromPop);
        window.setTimeout(() => {
          scope.resultsCmp.sortCmp.selectedSortBy = sortParam === ''
            ? 'osdl.pub_date_tdt desc, sys.src.item.lastmodified_tdt desc'
            : sortParam;
          scope.resultsCmp.sortCmp.refreshSort(sortParam);
          scope.refreshSelectPickers();
        }, 300);
      } else {
        // clear all facets
        this.resultsCmp.facetsCmp.facet_groups.forEach(group => group.solrFields.forEach((sf: any) => {
          sf.selected = false;
        }));
        this.resultsCmp.facetsCmp.selected_facets = [];
        this._osdl_solr_service.get([], '', updateFromPop);
        window.setTimeout(() => {
          // console.log('selectdisplay', $('.bootstrap-select').css('display'));
          scope.refreshSelectPickers();
        }, 300);
      }
    } catch(ex){
      console.log('checkQueryStringParams',ex);
    }

  }

  refreshSelectPickers() {
    $('select[name=sortpicker]').selectpicker('refresh');
    $('select[name=showNumpicker]').selectpicker('refresh');
    if ($('.bootstrap-select').css('display') === undefined) {
      $('select[name=sortpicker]').selectpicker('refresh');
      $('select[name=showNumpicker]').selectpicker('refresh');
    }
  }

  processResults(results: any) {
    if (results.response) {
      results.response.docs.forEach(result => {
        const serviceUrl = this._utilities.getMapServiceUrl(result);
        if (serviceUrl !== '') {
          this.getServiceMetadata.getMetedata(serviceUrl).subscribe((res => {
            if (!result['description']) {
              result['description'] = res['description'];
            }
            if (!result['url.thumbnail_s']) {
              result['url.thumbnail_s'] = serviceUrl + '/info/' + res['thumbnail'];
            }
          }));
        }
      });
    }
    return results;
  }

  ngOnInit() {
    // console.log('home loading',location.href);
    if (location.href.includes('catalog')) {
      this.router.navigate(['/']);
    }
    this.checkQueryStingParams();
    this.resultsCmp.pagerNumberRows = this._search_state_service.getState()
      ? +this._search_state_service.getState().get('rows')
      : this.resultsCmp.pagerNumberRows;
    this._results_store_service.selectionChanged$.subscribe(
      results => {
        // console.log('store updated! in home cmp', results);
        this.solr_results = this.processResults(results);
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }

}
