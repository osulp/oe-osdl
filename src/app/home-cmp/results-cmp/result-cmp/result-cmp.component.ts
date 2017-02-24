import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MapPreviewCmpComponent } from '../../../map-preview-cmp/map-preview-cmp.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-cmp',
  templateUrl: './result-cmp.component.html',
  styleUrls: ['./result-cmp.component.css']
})
export class ResultCmpComponent implements OnInit {
  @Input() viewType: any;
  @Input() solrResults: any[];
  @ViewChild(MapPreviewCmpComponent) modal: MapPreviewCmpComponent;  

  constructor(
    private router: Router
  ) { }

  gotoDetails(record: any) {
    this.router.navigate(['/details', { id: record.id }]);
  }

  preview(record: any) {
    this.modal.mapserviceUrl = record['url.mapserver_ss']
      ? record['url.mapserver_ss'][0]
      : record['url.wms_ss']
        ? record['url.wms_ss'][0]
        : record['url.wfs_ss']
          ? record['url.wfs_ss'][0]
          : record['url.kml_ss']
            ? record['url.kml_ss'][0]
            : '';
    this.modal.serviceName = record['title'];
    this.modal.show();
  }

  download(record: any) {
    console.log('download requested', record);
    // let record = domElem.getAttribute('record');
    // console.log('test',record);
    const a = window.document.createElement('a');
    a.href = record.links.length > 1 ? record.links[1] : '';
    a.download = record.title[0];
    a.target = '_blank';
    document.body.appendChild(a);
    // IE: "Access is denied"; 
    // see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }

  ngOnInit() {    
   }

}
