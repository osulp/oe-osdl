import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

declare var L: any;

@Injectable()
export class GetMapServiceDownloadSrvService {
  constructor(private jsonp: Jsonp) { }

  getStatus(url: string): Observable<any[]> {
    var gpService = L.esri.GP.service({
      url: 'https://lib-arcgis5.library.oregonstate.edu/arcgis/rest/services/_sandbox/URLToShapefile/GPServer/ZipExists/executeJob',
      useCors: false
    });

    var gpTask = gpService.createTask();

    gpTask.setParam("url", url);

    gpTask.run((error, response, raw) => {
      console.log('response?', error, response, raw);
      return {};
    });

    return null;
  }
}

