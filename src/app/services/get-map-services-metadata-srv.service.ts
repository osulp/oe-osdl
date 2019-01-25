import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GetMapServicesMetadataSrvService {

  constructor(private jsonp: Jsonp) { }

  getMetedata(url: string): Observable<any[]> {
    const params = new URLSearchParams();
    params.set('f', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    url = url
      .replace('http:', 'https:')
      .replace('arcgis/services', 'arcgis/rest/services')
      .split('/WMSServer')[0]
      + '/info/iteminfo';
    // console.log(url);
    return this.jsonp
      .get(url, { search: params })
      .map(function (res: Response) {
        // console.log('item info?', res);
        return res.json() || {};
      });
  }
}
