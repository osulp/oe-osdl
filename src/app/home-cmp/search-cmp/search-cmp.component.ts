import { Component, OnInit } from '@angular/core';
import { OsdlSolrSrvService, ResultsStoreSrvService } from '../../services/index';

declare var $: any;

@Component({
  selector: 'app-search-cmp',
  templateUrl: './search-cmp.component.html',
  styleUrls: ['./search-cmp.component.css']
})

export class SearchCmpComponent {
  isHandheld: boolean = $(window).width() < 768;
  temp_search_results: any;
  solr_results: any;
  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  ngOnInit() {
    this._osdl_solr_service.setBaseSearchState();
    this._osdl_solr_service.get();
    this._results_store_service.selectionChanged$.subscribe(
      results => {
        console.log('store updated! in search cmp', results);
        this.solr_results = results;
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}

