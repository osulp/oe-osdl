import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetMapServicesMetadataSrvService } from '../../services/index';
import { UtilitiesCls } from '../../utilities-cls';

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

  constructor(
    private getServiceMetadata: GetMapServicesMetadataSrvService,
    private _utilities: UtilitiesCls
  ) { }

  ngOnInit() {
  }

  ngOnChanges(change: any) {
    // console.log('desc-info got solr response change', change);
    if (change.solrResponse.currentValue.response) {
      this.record = change.solrResponse.currentValue.response.docs[0];
      console.log('details', this.record);
      this.facet_counts = change.solrResponse.currentValue.facet_counts;
      this.serviceUrl = this._utilities.getMapServiceUrl(this.record);
      if (this.serviceUrl) {
        this.getServiceMetadata.getMetedata(this.serviceUrl).subscribe((res => {
          if (!this.record['description']) {
            this.record['description'] = res['description'];
          }
          if (!this.record['url.thumbnail_s']) {
            this.record['url.thumbnail_s'] = this.serviceUrl + '/info/' + res['thumbnail'];
          }
        }));
      }
    }
  }
}
