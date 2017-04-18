import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rest-redirect-cmp',
  templateUrl: './rest-redirect-cmp.component.html',
  styleUrls: ['./rest-redirect-cmp.component.css']
})
export class RestRedirectCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('rest url', location);
    if (!location.href.includes('localhost')) {
      location.href = location.href.replace('/geoportal/', '/osdl-geoportal/');
    }
  }

}
