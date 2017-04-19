import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resources-cmp',
  templateUrl: './resources-cmp.component.html',
  styleUrls: ['./resources-cmp.component.css']
})
export class ResourcesCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('rest url', location);
    if (!location.href.includes('localhost')) {
      location.href = location.href.replace('/GPT9/', '/osdl-geoportal/');
    }
  }

}
