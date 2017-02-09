import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GetMapSrvService {
  EXPORT_MAP_URL: string = 'http://lib-arcgis2.library.oregonstate.edu/Geocortex/Essentials/dev/REST/sites/Template_GVH_27/map/export';
  mapOptions = {
    'mapOptions': {
      'showAttribution': true,
      'scale': 18055.9548219984,
      'extent': {
        'type': 'extent',
        'xmin': -13717986.990025882,
        'ymin': 5566167.8251344729,
        'xmax': -13714810.076037697,
        'ymax': 5567687.01107168,
        'spatialReference': {
          'wkid': 102100
        }
      },
      'spatialReference': {
        'wkid': 102100
      }
    },
    'operationalLayers': [{
      'id': 'ReportWorldBase',
      'title': 'ReportWorldBase',
      'opacity': 1,
      'dpi': 96,
      'outputSize': [200, 150],
      'minScale': 591657527.591555,
      'maxScale': 70.5310735,
      'url': 'http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer',
      'visibility': true
    }, {
      'id': 'userPoint',
      'opacity': 1,
      'minScale': 0,
      'maxScale': 0,
      'featureCollection': {
        'layers': [{
          'layerDefinition': {
            'name': 'polygonLayer',
            'geometryType': 'esriGeometryPolygon'
          },
          'featureSet': {
            'geometryType': 'esriGeometryPolygon',
            'features': [{
              'geometry': {
                'x': -13717497.315313416,
                'y': 5566833.4393739616,
                'spatialReference': {
                  'wkid': 102100
                }
              },
              'symbol': {
                'color': [255, 0, 0, 255],
                'width': 1.5,
                'type': 'esriSLS',
                'style': 'esriSLSSolid'
              }
            }
            ]
          }
        }
        ]
      },
      'visibility': true
    }
    ],
    'product': 'Geocortex Essentials 4.06'
  };

  constructor(
    private jsonp: Jsonp
  ) { }

  getMap(envelope: string): Observable<any[]> {
    const params = new URLSearchParams();
    //params.set('data',  JSON.stringify(this.mapOptions));
    params.set('outputFormat', 'png');
    params.set('dpi', '96');
    params.set('layers','25');
    params.set('imageWidth', '200');
    params.set('imageHeight', '150');
    params.set('f', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp
      .get(this.EXPORT_MAP_URL, { search: params })
      .map(function (res: Response) {
        console.log('map response', res);
        return res.json() || {};
      });
  }
}
