import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-osdl-geoportal-redirect-cmp',
  templateUrl: './to-osdl-geoportal-redirect-cmp.component.html',
  styleUrls: ['./to-osdl-geoportal-redirect-cmp.component.css']
})
export class ToOsdlGeoportalRedirectCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
     console.log('rest url', location);
    if (!location.href.includes('localhost')) {
      location.href = location.href.replace('/geoportal/', '/osdl-geoportal/');
    }
  }

}
