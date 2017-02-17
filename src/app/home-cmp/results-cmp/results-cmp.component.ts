import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResultCmpComponent } from './result-cmp/result-cmp.component';
import { SortBarCmpComponent } from './sort-bar-cmp/sort-bar-cmp.component';
import { FacetsCmpComponent } from './facets-cmp/facets-cmp.component';
import { OsdlSolrSrvService, ResultsStoreSrvService } from '../../services/index';

@Component({
  selector: 'app-results-cmp',
  templateUrl: './results-cmp.component.html',
  styleUrls: ['./results-cmp.component.css']
})
export class ResultsCmpComponent implements OnInit {
  @ViewChild(FacetsCmpComponent) facetsCmp: FacetsCmpComponent;
  @ViewChild(SortBarCmpComponent) sortCmp: SortBarCmpComponent;
  @ViewChild(ResultCmpComponent)
  viewType: any;
  solr_results: any = {};
  pagerStartNumber: number = 1;
  pagerNumberRows: number = 10;

  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  onViewTypeChangeHandler(view: any) {
    this.viewType = view;
  }

  onSortChange(selectedSort: any) {
    const sortParam = { key: 'sort', query: selectedSort, type: 'sort', selected: true };
    this.facetsCmp.setSelectedFacets([sortParam], 'sort', true);
  }

  onShowNumChange(showNum: any) {
    this.pagerNumberRows = +showNum;
    this._osdl_solr_service.pager(this.pagerStartNumber * this.pagerNumberRows, this.pagerNumberRows);
  }

  onFrameworkOnlyChange(showOnly: boolean) {
    const frameworkParam = { key: 'fq', query: 'keywords_ss:*Framework', type: 'framework', selected: showOnly };
    this.facetsCmp.setSelectedFacets([frameworkParam], 'framework', true);
  }

  onPagerChange(pageNumber: number) {
    console.log('emitted page number', pageNumber);
    this.pagerStartNumber = pageNumber;
    const solr_start_row = pageNumber - 1;
    this._osdl_solr_service.pager(solr_start_row * this.pagerNumberRows, this.pagerNumberRows);
  }

  ngOnInit() {
    this._results_store_service.selectionChanged$.subscribe(
      results => {
        console.log('store updated! in results cmp', results);
        this.solr_results = results;
        // check if framework removed from filter bar
        this.sortCmp.showFrameworkOnly = results.responseHeader.params.fq.toString().includes('Framework');
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}
