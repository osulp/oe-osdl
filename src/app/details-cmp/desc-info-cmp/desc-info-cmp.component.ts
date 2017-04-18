import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-desc-info-cmp',
  templateUrl: './desc-info-cmp.component.html',
  styleUrls: ['./desc-info-cmp.component.css']
})
export class DescInfoCmpComponent implements OnInit, OnChanges {
  @Input() solrResponse: any;
  metaInfo: any = 'all';
  record: any = {};
  facet_counts: any = {};
  serviceUrl = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(change: any) {
    // console.log('desc-info got solr response change', change);
    if (change.solrResponse.currentValue.response) {
      this.record = change.solrResponse.currentValue.response.docs[0];
      console.log('details', this.record);
      this.facet_counts = change.solrResponse.currentValue.facet_counts;
      this.serviceUrl = this.record['url.mapserver_ss']
        ? this.record['url.mapserver_ss'][0]
        : this.record['url.wms_ss']
          ? this.record['url.wms_ss'][0]
          : this.record['url.wfs_ss']
            ? this.record['url.wfs_ss'][0]
            : this.record['url.kml_ss']
              ? this.record['url.kml_ss'][0]
              : ''
                .replace('arcgis/services', 'arcgis/rest/services').split('/WMSServer?')[0];
    }
  }
}
