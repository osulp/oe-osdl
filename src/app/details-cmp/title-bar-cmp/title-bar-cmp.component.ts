import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GetMapSrvService } from '../../services/index';

@Component({
  selector: 'app-title-bar-cmp',
  templateUrl: './title-bar-cmp.component.html',
  styleUrls: ['./title-bar-cmp.component.css']
})
export class TitleBarCmpComponent implements OnInit, OnChanges {
  @Input() solrResponse: any = {};
  record: any = {};
  facet_counts: any = {};
  topics: any[] = [];
  map_box_url: any = '';


  constructor(
    private _get_map_srv: GetMapSrvService
  ) { }

  ngOnInit() {
    this._get_map_srv.getMap('').subscribe((res:any) => {
      this.map_box_url = res.href;
      console.log('map response', res);
    });
  }

  goto(href: any, type: any) {
    const a = window.document.createElement('a');
    a.href = href;
    if (type === 'download') {
      a.download = this.record.title;
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

  download(record: any) {
    this.goto(record.links.length > 1 ? record.links[1] : '', 'download');
  }

  ngOnChanges(change: any) {
    console.log('title bar got solr response change', change);
    if (change.solrResponse.currentValue.response) {
      this.record = change.solrResponse.currentValue.response.docs[0];
      // console.log('details', this.record);
      for (const topic in change.solrResponse.currentValue.facet_counts.facet_queries) {
        if (change.solrResponse.currentValue.facet_counts.facet_queries[topic] > 0) {
          this.topics.push(topic);
        }
      }
      this.facet_counts = change.solrResponse.currentValue.facet_counts;
    }
  }

}
