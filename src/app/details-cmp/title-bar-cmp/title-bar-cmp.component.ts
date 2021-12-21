import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MapPreviewCmpComponent } from '../../map-preview-cmp/map-preview-cmp.component';
import { MapSrvcDownloadFormCmpComponent } from '../../map-srvc-download-form-cmp/map-srvc-download-form-cmp.component';
// import { DownloadHelperCmpComponent } from '../../download-helper-cmp/download-helper-cmp.component';
import { UtilitiesCls } from '../../utilities-cls';
import { Agent } from 'https';

declare var L: any;
declare var ga: any;

@Component({
  selector: 'app-title-bar-cmp',
  templateUrl: './title-bar-cmp.component.html',
  styleUrls: ['./title-bar-cmp.component.css']
})
export class TitleBarCmpComponent implements OnChanges {
  @Input() solrResponse: any = {};
  @ViewChild(MapPreviewCmpComponent) modal: MapPreviewCmpComponent;
  @ViewChild(MapSrvcDownloadFormCmpComponent) downloadModal: MapSrvcDownloadFormCmpComponent;
  // @ViewChild(DownloadHelperCmpComponent) downloadHelperModal: DownloadHelperCmpComponent;
  record: any = {};
  facet_counts: any = {};
  topics: any[] = [];
  map_box_url: any = '';
  map: any;
  hasPreview: boolean = false;
  hasDownload: boolean = true;
  isApplication: boolean = false;
  downloadUrl: any = '';
  imageExtractionUrl = 'https://geo.maps.arcgis.com/apps/MapSeries/index.html?appid=0ab5c3f0a4364e049348cd4daa621443';


  constructor(
    private _utilities: UtilitiesCls
  ) { }

  preview(record: any) {
    this.modal.mapserviceUrl = this._utilities.getMapServiceUrl(record);
    this.modal.serviceName = record['title'];
    this.modal.show();
  }

  loadMap() {
    this.map = L.map('static-map', {
      zoomControl: false,
      scrollWheelZoom: false
    });
    const initialCoords = [44, -121];
    const initialZoom = 5;
    this.map.setView(initialCoords, initialZoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      {
        // tslint:disable-next-line:max-line-length
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
      }).addTo(this.map);

    if (this.record.envelope_geo) {
      const lat_min = +this.record.envelope_geo[0].split(' ')[1];
      const lat_max = +this.record.envelope_geo[0].split(' ')[3];
      const long_min = +this.record.envelope_geo[0].split(' ')[0];
      const long_max = +this.record.envelope_geo[0].split(' ')[2];

      const polygon: any = L.polygon([
        [lat_min, long_min],
        [lat_max, long_min],
        [lat_max, long_max],
        [lat_min, long_max]
      ], {
        color: '#C34500',
        fillColor: '#C34500',
        fillOpacity: 0.2
      }).addTo(this.map);
      this.map.fitBounds(polygon.getBounds().pad(.1));
    }
    this.map.dragging.disable();

  }

  goto(href: any, type: any) {
    const a = window.document.createElement('a');
    a.href = href;
    if (type === 'download') {
      a.download = this.record.title;
      if (!window.location.href.includes('localhost')) {
        if (ga) {
          ga('send', 'event', {
            eventCategory: 'Download Link',
            eventAction: 'click',
            eventLabel: this.record.title,
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

  gotoSource(record: any) {
    this.goto(record.links.length > 0 ? record.links[0] : '', 'link');
  }

  gotoMetadata(record: any) {
    this.goto(record['url.metadata_s'], 'link');
  }

  gotoCollection(collection: any) {
    window.location.href = 'search;fq=sys.src.collections_ss:"' + collection + '"';
  }

  download(record: any) {
    // const isFTP = record.links.length > 1 ? record.links[1].includes('ftp:') ? true : false : false;
    // const browserAgent = this._utilities.browserCheck();
    if (this.downloadUrl === this.imageExtractionUrl){
window.open(this.imageExtractionUrl,'_blank');
    } else {
      this.downloadModal.checkDownload(record);
    }

    // if (browserAgent['browser']['name'] === 'Chrome' && isFTP) {
    //   this.downloadHelperModal.show(record.links[1]);
    // }

    // const linkType = record.links.length > 1 ? record.links[1].includes('.zip') ? 'download' : 'link' : 'link';
    // this.goto(record.links.length > 1 ? record.links[1] : '', linkType);
  }

  ngOnChanges(change: any) {
    if (change.solrResponse.currentValue.response) {
      this.record = change.solrResponse.currentValue.response.docs[0];

      this.loadMap();
      this.hasPreview = this._utilities.getMapServiceUrl(this.record) !== '';

      this.isApplication = this.record['contentType_ss'] ? this.record['contentType_ss'][0] === 'Applications' : false;

      this.hasDownload = this.record['links']
        ? this.record['links'].length > 1
          ? (this.record['links'][1].indexOf('.zip') !== -1
            || this.record['links'][1].indexOf('ftp:') !== -1)
          : this.record['url.mapserver_ss']
            ? this.record['url.mapserver_ss'].length > 0
            : false
        : false;

      // add download button for imagery tile download tool
      let hasImageExtractionUrl = this.record['links'].filter(li => li.indexOf(this.imageExtractionUrl) !== -1 )
        .length > 0;
      this.hasDownload = hasImageExtractionUrl ? true : this.hasDownload;

      this.downloadUrl = hasImageExtractionUrl
        ? this.imageExtractionUrl
        : this.hasDownload
          ? this.record.links.length > 1 ? this.record.links[1] : '' : '';
      // this.hasDownload = this.record['links']
      //   ? this.record['links'].length > 1
      //     ? this.record['links'][1].includes('.zip') || this.record['links'][1].includes('ftp:')
      //     : false
      //   : false;

      for (let topic in change.solrResponse.currentValue.facet_counts.facet_queries) {
       // console.log('topic :: ', topic);
        if (change.solrResponse.currentValue.facet_counts.facet_queries[topic] > 0) {
          console.log(topic);
          let returntopic = { label : topic.split(' OR')[0]
            .replace('Coastal Marine', 'Coastal and Marine')
            .replace('Land*Use Land*Cover', 'Land Use Land Cover')
            .replace('?', ' ')
            .replace('OregonImagery', 'Imagery'),
            query : topic};
          this.topics.push(returntopic);
        }
      }
      this.facet_counts = change.solrResponse.currentValue.facet_counts;
    }
  }

}
