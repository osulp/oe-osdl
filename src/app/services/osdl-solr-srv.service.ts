import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class OsdlSolrSrvService {
    //_resultStore: BehaviorSubject<any>;
    SOLRURL: string = 'http://lib-solr1.library.oregonstate.edu:8984/solr/geoportal/select';

    constructor(private jsonp: Jsonp) {
        //this._resultStore = <BehaviorSubject<any>>new BehaviorSubject({});
    }

    // get results() {
    //     return this._resultStore.asObservable();
    // }

    // loadAll() {
    //     this.get().subscribe(data => {
    //         this._resultStore.next(data);
    //     });
    // }

    get(): Observable<any[]> {
        const params = new URLSearchParams();
        params.set('start', '0');
        params.set('rows', '10');
        params.set('wt', 'json');
        params.set('facet', 'true');
        params.set('q', '*:*');
        params.set('fq', 'id.table_s:table.docindex');
        params.set('facet.field', 'sys.metadatatype.identifier_s');
        params.append('facet.field', 'keywords');
        params.append('facet.field', 'keywords_ss');
        params.append('facet.field', 'contact.organizations_ss');
        params.append('facet.field', 'sys.src.collections_txt');
        params.append('facet.field', 'sys.src.collections_ss');
        params.append('facet.field', 'dataAccessType_ss');
        params.append('facet.field', 'sys.src.site.name_s');
        params.append('facet.field', 'sys.src.site.name_s');
        params.set('f.sys.metadatatype.identifier_s.facet.mincount', '0');
        params.set('f.sys.metadatatype.identifier_s.facet.limit', '10');
        params.set('f.keywords.facet.mincount', '1');
        params.set('f.keywords_ss.facet.limit', '10');
        params.set('f.contact.people_ss.facet.mincount', '1');
        params.set('f.contact.organizations_ss.facet.limit', '10');
        params.set('f.keywords.facet.mincount', '1');
        params.set('f.keywords.facet.limit', '10');
        params.set('f.contact.organizations_ss.facet.mincount', '1');
        params.set('f.contact.organizations_ss.facet.limit', '10');
        params.set('f.contact.people_ss.facet.mincount', '1');
        params.set('f.contact.people_ss.facet.limit', '10');
        params.set('f.sys.src.collections_txt.facet.mincount', '1');
        params.set('f.sys.src.collections_txt.facet.limit', '10');
        params.set('f.sys.src.collections_ss.facet.mincount', '1');
        params.set('f.sys.src.collections_ss.facet.limit', '10');
        params.set('f.dataAccessType_ss.facet.mincount', '1');
        params.set('f.dataAccessType_ss.facet.limit', '10');
        params.set('f.sys.src.site.name_s.facet.mincount', '1');
        params.set('f.sys.src.site.name_s.facet.limit', '10');
        params.set('f.sys.src.collections_ss.facet.limit', '10');
        params.set('json.wrf', 'JSONP_CALLBACK');
        return this.jsonp
            .get(this.SOLRURL, { search: params })
            .map(function (res: Response) {
                return res.json() || {};
            });
    }
}
