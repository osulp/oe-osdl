import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facets-cmp',
  templateUrl: './facets-cmp.component.html',
  styleUrls: ['./facets-cmp.component.css']
})
export class FacetsCmpComponent implements OnInit {

  facet_groups:any[] = [];
  constructor() { }

  ngOnInit() {
    ["Collections","Formats","Sources","Topics"].forEach((facet:any) => {
      this.facet_groups.push({
        name:facet,
        expanded: facet === "Topics"
      });
    });    
  }

}
