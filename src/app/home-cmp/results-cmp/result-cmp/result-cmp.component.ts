import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-cmp',
  templateUrl: './result-cmp.component.html',
  styleUrls: ['./result-cmp.component.css']
})
export class ResultCmpComponent implements OnInit {
  @Input() viewType: any;
  @Input() solrResults: any[];

  constructor() { }

  download(record: any) {
    console.log('download requested', record);
    //let record = domElem.getAttribute('record');
    //console.log('test',record);
    let a = window.document.createElement('a');
    a.href = record.links.length > 1 ? record.links[1] : '';
    a.download = record.title[0];
    document.body.appendChild(a);
    // IE: "Access is denied"; 
    // see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }

  ngOnInit() { }

}
