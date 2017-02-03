import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';

@Injectable()
export class SearchStateSrvService {

  stateChanged$: ReplaySubject<any> = new ReplaySubject<{}>(1);
  private _searchState: URLSearchParams;

  constructor() { }

  getState(): URLSearchParams {
    return this._searchState;
    // this.stateChanged$.next(this._searchState);
  }

  updateState(params): void {
    console.log('search state updated',params);
    this._searchState = params;
    //this.stateChanged$.next(params);
  }

  setBaseSearchState() {
    this._searchState = new URLSearchParams();
    this._searchState.set('start', '0');
    this._searchState.set('rows', '10');
    this._searchState.set('wt', 'json');
    this._searchState.set('facet', 'true');
    this._searchState.set('q', '*:*');
    this._searchState.set('fq', 'id.table_s:table.docindex');
    this._searchState.set('sort', 'sys.src.item.lastmodified_tdt desc');
    this._searchState.set('facet.field', 'sys.metadatatype.identifier_s');
    this._searchState.append('facet.field', 'keywords');
    this._searchState.append('facet.field', 'keywords_ss');
    this._searchState.append('facet.field', 'contact.organizations_ss');
    this._searchState.append('facet.field', 'sys.src.collections_txt');
    this._searchState.append('facet.field', 'sys.src.collections_ss');
    this._searchState.append('facet.field', 'dataAccessType_ss');
    this._searchState.append('facet.field', 'sys.src.site.name_s');
    this._searchState.append('facet.field', 'sys.src.site.name_s');
    this._searchState.set('facet.query', 'Admin Boundaries');
    this._searchState.append('facet.query', 'Bioscience');
    this._searchState.append('facet.query', 'Cadastral');
    this._searchState.append('facet.query', 'Climate');
    this._searchState.append('facet.query', 'Coastal and Marine');
    this._searchState.append('facet.query', 'Elevation');
    this._searchState.append('facet.query', 'Geodetic Control');
    this._searchState.append('facet.query', 'Geoscience');
    this._searchState.append('facet.query', 'Hazards');
    this._searchState.append('facet.query', 'Preparedness');
    this._searchState.append('facet.query', 'Hydrography');
    this._searchState.append('facet.query', 'Imagery');
    this._searchState.append('facet.query', 'Land Use/Land Cover');
    this._searchState.append('facet.query', 'Transportation');
    this._searchState.append('facet.query', 'Utilities');
    this._searchState.append('facet.query', 'Reference');
    this._searchState.set('f.sys.metadatatype.identifier_s.facet.mincount', '0');
    this._searchState.set('f.sys.metadatatype.identifier_s.facet.limit', '10');
    this._searchState.set('f.keywords.facet.mincount', '1');
    this._searchState.set('f.keywords_ss.facet.limit', '10');
    this._searchState.set('f.contact.people_ss.facet.mincount', '1');
    this._searchState.set('f.contact.organizations_ss.facet.limit', '10');
    this._searchState.set('f.keywords.facet.mincount', '1');
    this._searchState.set('f.keywords.facet.limit', '10');
    this._searchState.set('f.contact.organizations_ss.facet.mincount', '1');
    this._searchState.set('f.contact.organizations_ss.facet.limit', '10');
    this._searchState.set('f.contact.people_ss.facet.mincount', '1');
    this._searchState.set('f.contact.people_ss.facet.limit', '10');
    this._searchState.set('f.sys.src.collections_txt.facet.mincount', '1');
    this._searchState.set('f.sys.src.collections_txt.facet.limit', '10');
    this._searchState.set('f.sys.src.collections_ss.facet.mincount', '1');
    this._searchState.set('f.sys.src.collections_ss.facet.limit', '10');
    this._searchState.set('f.dataAccessType_ss.facet.mincount', '1');
    this._searchState.set('f.dataAccessType_ss.facet.limit', '10');
    this._searchState.set('f.sys.src.site.name_s.facet.mincount', '1');
    this._searchState.set('f.sys.src.site.name_s.facet.limit', '10');
    this._searchState.set('f.sys.src.collections_ss.facet.limit', '10');
    this._searchState.set('json.wrf', 'JSONP_CALLBACK');
  }
}

