import { Component, OnInit, Input, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MapPreviewCmpComponent } from '../../../map-preview-cmp/map-preview-cmp.component';
import { MapSrvcDownloadFormCmpComponent } from '../../../map-srvc-download-form-cmp/map-srvc-download-form-cmp.component';
import { Router } from '@angular/router';
import { UtilitiesCls } from '../../../utilities-cls';
//import { GetMapServiceDownloadSrvService} from '../../../services/index'

declare var $: any;
declare var L: any;
declare var ga: any;

@Component({
  selector: 'app-result-cmp',
  templateUrl: './result-cmp.component.html',
  styleUrls: ['./result-cmp.component.css']
})
export class ResultCmpComponent implements OnInit, AfterViewChecked {
  @Input() viewType: any;
  @Input() solrResults: any[];
  @ViewChild(MapPreviewCmpComponent) modal: MapPreviewCmpComponent;
  @ViewChild(MapSrvcDownloadFormCmpComponent) downloadModal: MapSrvcDownloadFormCmpComponent;
  serviceUrl: any;


  constructor(
    private router: Router,
    private _changeDetectionRef: ChangeDetectorRef,
    private _utilities: UtilitiesCls
    //private _getMapSrvcDownload: GetMapServiceDownloadSrvService
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
    return this._utilities.getMapServiceUrl(result) !== '';
  }
  hasDownload(result: any) {
    let isAGS = result['url.mapserver_ss'] ? result['url.mapserver_ss'].length > 0 : false
    return result['links']
      ? (result['links'].filter(l => l.includes('.zip') || l.includes('ftp:')).length > 0
        || isAGS)
      : false;
  }
  download(record: any) {
    this.downloadModal.checkDownload(record);
  }

  ngAfterViewChecked() {
    this._changeDetectionRef.detectChanges();
  }


  ngOnInit() { }

}
