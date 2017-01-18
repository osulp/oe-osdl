import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desc-info-cmp',
  templateUrl: './desc-info-cmp.component.html',
  styleUrls: ['./desc-info-cmp.component.css']
})
export class DescInfoCmpComponent implements OnInit {
  metaInfo:any = 'all';
  constructor() { }

  ngOnInit() {
  }

}
