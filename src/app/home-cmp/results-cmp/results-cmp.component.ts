import { Component, Input, OnInit } from '@angular/core';
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
  viewType: any;
  solr_results: any = {};
  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  onViewTypeChangeHandler(view: any) {
    this.viewType = view;
  }

  onSortChange(selectedSort: any) {
    const sortParam = [{ key: 'sort', value: selectedSort }];
    this._osdl_solr_service.get(sortParam, 'sort');
  }

  onFrameworkOnlyChange(showOnly: boolean) {
    const frameworkParam = showOnly ? [{ key: 'fq', value: 'keywords_ss:*Framework' }] : [];
    this._osdl_solr_service.get(frameworkParam, 'framework');
  }

  ngOnInit() {

    this._results_store_service.selectionChanged$.subscribe(
      results => {
        //console.log('store updated! in results cmp', results);
        this.solr_results = results;
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}
