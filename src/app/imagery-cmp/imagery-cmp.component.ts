import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imagery-cmp',
  templateUrl: './imagery-cmp.component.html',
  styleUrls: ['./imagery-cmp.component.css']
})
export class ImageryCmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gotoImagery() {
    window.open('https://spatialdata.oregonexplorer.info/geoportal/search;fq=OregonImagery%20OR%20OregonImagery*','_parent');
  }

}
