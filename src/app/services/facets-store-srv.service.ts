import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class FacetsStoreSrvService {

  constructor(private http:Http) { }

  getFacetStore(){
    return this.http.request('./assets/facets/facets.json')
                 .map(res => res.json());
  }

}
