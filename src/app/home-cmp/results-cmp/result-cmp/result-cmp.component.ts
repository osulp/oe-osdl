import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-cmp',
  templateUrl: './result-cmp.component.html',
  styleUrls: ['./result-cmp.component.css']
})
export class ResultCmpComponent implements OnInit {
  @Input() viewType:any;

  constructor() { }

  ngOnInit() {
  }

}
