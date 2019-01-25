import { Component, OnInit } from '@angular/core';
import { UtilitiesCls } from '../utilities-cls';

declare var L: any;
declare var ga: any;

@Component({
  selector: 'app-map-srvc-download-form-cmp',
  templateUrl: './map-srvc-download-form-cmp.component.html',
  styleUrls: ['./map-srvc-download-form-cmp.component.css']
})
export class MapSrvcDownloadFormCmpComponent implements OnInit {
  visible = false;
  visibleAnimate = false;
  requestURL = '';
  status = 'checking';

  constructor(
    private _utilities: UtilitiesCls
  ) { }

  ngOnInit() {
  }

  show() {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  hide() {
    this.visible = false;
  }

  checkDownload(record: any) {
    let srvcUrl = this._utilities.getMapServiceUrl(record);
    srvcUrl = srvcUrl.endsWith('/MapServer') ? srvcUrl + '/0'
      : srvcUrl;
    if (srvcUrl !== '' && record.links.length <= 1) {
      //
      this.requestURL = srvcUrl;
      this.status = 'checking';
      this.show();
      const gpService = L.esri.GP.service({
        //url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/_sandbox/URLToShapefile/GPServer/ZipExists'
        url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/geoprocessing/URLToShp/GPServer/URLToShapefileValidate'
      });

      const gpTask = gpService.createTask();

      gpTask.on('initialized', () => {
        gpTask.setParam('layerName', record.title);
        gpTask.setParam('requestURL', srvcUrl);
        gpTask.setOutputParam('error');
        gpTask.setOutputParam('isError');
        gpTask.setOutputParam('processURL');
        gpTask.setOutputParam('downloadZip');
        gpTask.setOutputParam('downloadZipURL');
        gpTask.run((error, response, raw) => {
          if (response.downloadZipURL !== '') {
            this.getDownload(response.downloadZipURL, record.title);
            this.hide();
          } else {
            // ask user if they want us to process a full download
            this.status = 'showForm';
            this.requestURL = srvcUrl;
            this.show();
          }
        });
      });
    } else {
      this.hide();
      this.getDownload(record.links.length > 1 ? record.links[1] : '', record.title);
    }
  }

  getDownload(url: string, title?: string) {
    const a = window.document.createElement('a');
    a.href = url;
    if (url.includes('.zip')) {
      a.download = title;
      if (!window.location.href.includes('localhost')) {
        if (ga) {
          ga('send', 'event', {
            eventCategory: 'Download Link',
            eventAction: 'click',
            eventLabel: title,
            transport: 'beacon'
          });
        }
      }
    }
    a.target = '_blank';
    document.body.appendChild(a);
    // IE: "Access is denied";
    // see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    a.click();
    document.body.removeChild(a);
  }

  onFormSubmit(email: string) {
    const gpServiceDownload = L.esri.GP.service({
      //url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/_sandbox/URLToShapefile/GPServer/URLToShp'
      url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/geoprocessing/URLToShp/GPServer/URLToShp'
    });
    const gpTaskDownload = gpServiceDownload.createTask();
    gpTaskDownload.on('initialized', () => {
      gpTaskDownload.setParam('restURL', this.requestURL);
      gpTaskDownload.setParam('email', email);
      gpTaskDownload.run((error, response, raw) => {
        console.log('download');
      });
    });
    this.hide();
  }
}
