import { Component, OnInit } from '@angular/core';
import {SearchCmpComponent} from './search-cmp/search-cmp.component';
import {ResultsCmpComponent} from './results-cmp/results-cmp.component';

@Component({
  selector: 'app-home-cmp',
  templateUrl: './home-cmp.component.html',
  styleUrls: ['./home-cmp.component.css']
})
export class HomeCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
