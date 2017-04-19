import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-georss-redirect-cmp',
  templateUrl: './georss-redirect-cmp.component.html',
  styleUrls: ['./georss-redirect-cmp.component.css']
})
export class GeorssRedirectCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('rest url', location);
    if (!location.href.includes('localhost')) {
      location.href = location.href.replace('/geoportal/', '/osdl-geoportal/');
    }
  }

}
