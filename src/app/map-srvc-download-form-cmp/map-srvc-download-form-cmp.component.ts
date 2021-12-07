import { Component, OnInit, ViewChild } from '@angular/core';
import { DownloadHelperCmpComponent } from '../download-helper-cmp/download-helper-cmp.component';
import { UtilitiesCls } from '../utilities-cls';

declare var L: any;
declare var ga: any;

@Component({
  selector: 'app-map-srvc-download-form-cmp',
  templateUrl: './map-srvc-download-form-cmp.component.html',
  styleUrls: ['./map-srvc-download-form-cmp.component.css']
})
export class MapSrvcDownloadFormCmpComponent implements OnInit {
  @ViewChild(DownloadHelperCmpComponent) downloadHelperModal: DownloadHelperCmpComponent;
  visible = false;
  visibleAnimate = false;
  requestURL = '';
  status = 'checking';
  imageExtractionUrl = 'https://geo.maps.arcgis.com/apps/MapSeries/index.html?appid=0ab5c3f0a4364e049348cd4daa621443';

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
    let returnUrl = '';
    if (srvcUrl !== '' && record.links.length <= 1) {
      //
      this.requestURL = srvcUrl;
      this.status = 'checking';
      this.show();
      const gpService = L.esri.GP.service({
        // url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/_sandbox/URLToShapefile/GPServer/ZipExists'
        url: 'https://lib-arcgis1.library.oregonstate.edu/arcgis/rest/services/geoprocessing/URLToShapefileValidate/GPServer/URLToShapefileValidate'
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
      returnUrl = record.links.length > 1 ? record.links[1] : '';
      let hasimageExtractionUrl = record.links.filter(li => li.indexOf(this.imageExtractionUrl) !== -1).length > 0;
      if (hasimageExtractionUrl) {
        window.open(this.imageExtractionUrl, '_blank');
      } else {


        this.getDownload(returnUrl, record.title);
        const isFTP = record.links.length > 1 ? record.links[1].includes('ftp:') ? true : false : false;
        const isHTTP = record.links.length > 1 ? record.links[1].includes('http:') ? true : false : false;
        const browserAgent = this._utilities.browserCheck();
        if (browserAgent['browser']['name'] === 'Chrome' && (isFTP || isHTTP)) {
          this.downloadHelperModal.show(record.links[1]);
          this.hide();
        } else {
          this.hide();
        }
      }
    }
    return returnUrl;
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
    this.visible = true;
  }

  onFormSubmit(email: string) {
    const gpServiceDownload = L.esri.GP.service({
      // url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/_sandbox/URLToShapefile/GPServer/URLToShp'
      // url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/geoprocessing/URLToShp/GPServer/URLToShp'
      url: 'https://lib-arcgis1.library.oregonstate.edu/arcgis/rest/services/geoprocessing/URLToShp/GPServer/URLToShp'
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
