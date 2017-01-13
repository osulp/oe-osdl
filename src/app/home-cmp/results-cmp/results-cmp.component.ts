import { Component, OnInit } from '@angular/core';
import {ResultCmpComponent} from './result-cmp/result-cmp.component';
import {SortBarCmpComponent} from './sort-bar-cmp/sort-bar-cmp.component';

import {FacetsCmpComponent} from './facets-cmp/facets-cmp.component';

@Component({
  selector: 'app-results-cmp',
  templateUrl: './results-cmp.component.html',
  styleUrls: ['./results-cmp.component.css']
})
export class ResultsCmpComponent implements OnInit {
  viewType:any;
  constructor() { }

  onViewTypeChangeHandler(view:any){
    this.viewType = view;
  }

  ngOnInit() {
  }

}
