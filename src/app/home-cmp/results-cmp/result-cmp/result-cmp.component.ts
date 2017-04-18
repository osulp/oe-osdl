import { Component, OnInit, Input, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MapPreviewCmpComponent } from '../../../map-preview-cmp/map-preview-cmp.component';
import { Router } from '@angular/router';
import { UtilitiesCls } from '../../../utilities-cls';

declare var $: any;

@Component({
  selector: 'app-result-cmp',
  templateUrl: './result-cmp.component.html',
  styleUrls: ['./result-cmp.component.css']
})
export class ResultCmpComponent implements OnInit, AfterViewChecked {
  @Input() viewType: any;
  @Input() solrResults: any[];
  @ViewChild(MapPreviewCmpComponent) modal: MapPreviewCmpComponent;
  serviceUrl: any;


  constructor(
    private router: Router,
    private _changeDetectionRef: ChangeDetectorRef,
    private _utilities: UtilitiesCls    
  ) { }

  gotoDetails(evt: any, record: any) {
    const downloadParent = $(evt.srcElement).closest('.record-download');
    const previewParent = $(evt.srcElement).closest('.record-preview');
    if (previewParent.length === 0 && downloadParent.length === 0) {
      this.router.navigate(['/details', { id: record.id }]);
    }
  }

  preview(record: any) {    
    this.modal.mapserviceUrl = this._utilities.getMapServiceUrl(record);
    this.modal.serviceName = record['title'];
    this.modal.show();
  }

  sourceLookup(source: any) {
    return this._utilities.sourceLookup(source);
  }

  hasPreview(result: any) {
    return result['url.mapserver_ss']
      || result['url.wms_ss']
      || result['url.wfs_ss']
      || result['url.klm_ss']
      || result['sys.src.item.url_s']
      ? true
      : false;
  }
  hasDownload(result: any) {
    return result['links'] ? result['links'].filter(l => l.includes('.zip') || l.includes('ftp:')).length > 0 : false;
  }
  download(record: any) {
    const a = window.document.createElement('a');
    a.href = record.links.length > 1 ? record.links[1] : '';
    if (record.links[1].includes('.zip')) {
      a.download = record.title[0];
    }
    a.target = '_blank';
    document.body.appendChild(a);
    // IE: "Access is denied"; 
    // see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }

  ngAfterViewChecked() {
    this._changeDetectionRef.detectChanges();
  }


  ngOnInit() { }

}
