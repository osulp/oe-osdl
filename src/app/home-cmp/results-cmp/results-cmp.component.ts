import { Component, Input, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ResultCmpComponent } from './result-cmp/result-cmp.component';
import { SortBarCmpComponent } from './sort-bar-cmp/sort-bar-cmp.component';
import { FacetsCmpComponent } from './facets-cmp/facets-cmp.component';
import { PagerCmpComponent } from './pager-cmp/pager-cmp.component';
import { OsdlSolrSrvService, ResultsStoreSrvService, SearchStateSrvService } from '../../services/index';

declare var $: any;

@Component({
  selector: 'app-results-cmp',
  templateUrl: './results-cmp.component.html',
  styleUrls: ['./results-cmp.component.css']
})
export class ResultsCmpComponent implements OnInit, AfterViewInit {
  @Input() isMobile: boolean;
  @ViewChild(FacetsCmpComponent) facetsCmp: FacetsCmpComponent;
  @ViewChild(SortBarCmpComponent) sortCmp: SortBarCmpComponent;
  @ViewChildren(PagerCmpComponent) pagers: QueryList<PagerCmpComponent>;
  viewType: any;
  solr_results: any = {};
  pagerStartNumber: number = 1;
  pagerNumberRows: number = 10;
  showMobileFacets: boolean = false;

  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService,
    public _search_state_service: SearchStateSrvService
  ) { }

  onViewTypeChangeHandler(view: any) {
    this.viewType = view;
  }

  onSortChange(selectedSort: any) {
    const sortParam = { key: 'sort', query: selectedSort, type: 'sort', selected: true };
    this.facetsCmp.setSelectedFacets([sortParam], 'sort', true);
  }

  onShowNumChange(showNum: any) {
    console.log('num change check', this.pagerNumberRows, showNum);
    if (this.pagerNumberRows !== +showNum) {
      this.pagerNumberRows = +showNum;
      this._osdl_solr_service.pager(this.pagerStartNumber * this.pagerNumberRows, this.pagerNumberRows);
      this.pagers.forEach((pager: any) => {
        pager.currentPage = 1;
      });
    }
  }

  onFrameworkOnlyChange(showOnly: boolean) {
    const frameworkParam = { key: 'fq', query: 'keywords_ss:*Framework', type: 'framework', selected: showOnly };
    this.facetsCmp.setSelectedFacets([frameworkParam], 'framework', true);
  }

  onPagerChange(pageNumber: number, scroll?: boolean) {
    console.log('emitted page number', pageNumber);
    this.pagerStartNumber = pageNumber;
    const solr_start_row = pageNumber - 1;
    this._osdl_solr_service.pager(solr_start_row * this.pagerNumberRows, this.pagerNumberRows);
    if (scroll) {
      document.getElementById('data-set-num').scrollIntoView();
    }
  }



  ngAfterViewInit() {
    const search_state = this._search_state_service.getState();
    if (search_state) {
      if (this.pagers) {
        const currentPage = +search_state.get('start') / +search_state.get('rows') + 1;
        console.log('start row', search_state.paramsMap.get('start'), currentPage);
        this.pagers.forEach((pager: any, idx: number) => {
          console.log('current page?', currentPage);
          pager.currentPage = currentPage - 1;
          if (idx === 0) {
            //console.log('jesus');
            this.onPagerChange(currentPage);
          }
        });
      }
      this.sortCmp.selectedShowNum = search_state.get('rows');
      this.sortCmp.onShowNumChangeEvt.emit(+search_state.get('rows'));
    }
  }

  ngOnInit() {
    this._results_store_service.selectionChanged$.subscribe(
      results => {
        //console.log('store updated! in results cmp', results);
        this.solr_results = results;
        // check if framework removed from filter bar
        this.sortCmp.showFrameworkOnly = results.responseHeader.params.fq.toString().includes('Framework');
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}
