import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-search-cmp',
  templateUrl: './search-cmp.component.html',
  styleUrls: ['./search-cmp.component.css']
})

export class SearchCmpComponent {
  isHandheld: boolean = $(window).width() < 768;

  constructor() { }

  ngOnIt() { }
}
