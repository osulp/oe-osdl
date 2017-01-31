import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchCmpComponent } from './search-cmp/search-cmp.component';
import { ResultsCmpComponent } from './results-cmp/results-cmp.component';
import { OsdlSolrSrvService, ResultsStoreSrvService } from '../services/index';

@Component({
  selector: 'app-home-cmp',
  templateUrl: './home-cmp.component.html',
  styleUrls: ['./home-cmp.component.css']
})
export class HomeCmpComponent implements OnInit {
  solr_results: any;
  @ViewChild(ResultsCmpComponent) resultsCmp: ResultsCmpComponent;
  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  onRemoveFilterHandler(filter: any) {
    filter.selected = false;   
    this.resultsCmp.facetsCmp.setSelectedFacets(filter);
  }

  ngOnInit() {
    // this._osdl_solr_service.get().subscribe((results: any) => {
    //   this._results_store_service.updateResults([results]);
    //   console.log('results from solr search', results);
    // });

    this._results_store_service.selectionChanged$.subscribe(
      results => {
        console.log('store updated! in home cmp', results);
        this.solr_results = results;
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }

}
