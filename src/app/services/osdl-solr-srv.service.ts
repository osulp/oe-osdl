import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResultsStoreSrvService } from './results-store-srv.service';
import { SearchStateSrvService } from './search-state-srv.service';

@Injectable()
export class OsdlSolrSrvService {
    // SOLRURL: string = 'http://lib-solr1.library.oregonstate.edu:8984/solr/geoportal/select';
    SOLRURL: string = 'http://solr1.library.oregonstate.edu/solr/geoportal/select';

    constructor(
        private jsonp: Jsonp,
        private _resultStore: ResultsStoreSrvService,
        private _searchState: SearchStateSrvService
    ) { }

    setBaseSearchState() {
        this._searchState.setBaseSearchState();
    }

    textSearch(newParams?: any[], update?: boolean): Observable<any[]> {
        const params = this.setParams(newParams, 'textquery', update);
        return this.jsonp
            .get(this.SOLRURL, { search: params })
            .map(function (res: Response) {
                return res.json().response.docs || {};
            });
    }

    setParams(newParams: any[], searchType: any, update?: boolean) {
        const frameworkQuery = 'keywords_ss:*Framework';
        const params: URLSearchParams = this._searchState.getState();
        // get state param types to catch remove
        const fqParams = params.getAll('fq').filter(p => p !== frameworkQuery);
        const qParams = params.getAll('q');
        // const frameworkParam = params.getAll('fq').filter(p => p === frameworkQuery);
        // console.log('fqparams', fqParams);
        // console.log('qparams', qParams);        
        // console.log('get check', params, searchType, newParams);
        if (newParams) {
            if (newParams.length > 0) {
                const new_q_params = newParams.filter(np => np.type === 'textquery');
                const new_fq_params = newParams.filter(nfq => ['facets', 'facet', 'query'].indexOf(nfq.type) !== -1);
                const new_framework_param = newParams.filter(fp => fp.type === 'framework');

                const remove_fq = fqParams.length > new_fq_params.length;
                const remove_q = qParams.length > new_q_params.length;

                let fqCounter = 0;
                newParams.forEach((p: any, idx: number) => {
                    // console.log('processing param', p);
                    if (p.type) {
                        switch (p.type) {
                            case 'textquery':
                                params.delete('q');
                                params.set('q', p.value === '' ? '*:*' : p.value);
                                break;
                            case 'facets':
                            case 'facet':
                            case 'query':
                                if (fqCounter === 0) {
                                    params.delete('fq');
                                    params.set('fq', 'id.table_s:table.docindex');
                                }
                                params.append(p.key, p.value + ' OR ' + p.value.replace(/\ /g, '') + '*');
                                fqCounter++;
                                break;
                            case 'sort':
                                params.delete('sort');
                                params.set('sort', p.value);
                                break;
                            case 'framework':
                                if (params.getAll('fq').length > 0) {
                                    params.append(p.key, p.value);
                                } else {
                                    params.delete('fq');
                                    fqParams.forEach((fp: any, fidx: number) => {
                                        if (fidx === 0) {
                                            params.set('fq', fp);
                                        } else {
                                            params.append('fq', fp);
                                        }
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
                if (remove_q) {
                    console.log('remove q');
                    params.delete('q');
                    params.set('q', '*:*');
                }
                if (remove_fq) {
                    console.log('remove fq');
                    // check framework
                    if (new_fq_params.length === 0) {
                        params.delete('fq');
                        params.set('fq', 'id.table_s:table.docindex');
                        if (new_framework_param.length === 1) {
                            params.append('fq', frameworkQuery);
                        }
                    }
                }
                if (new_framework_param.length === 1 && params.getAll('fq').filter(fq => fq === frameworkQuery).length === 0) {
                    params.append('fq', frameworkQuery);
                }
            } else {
                if (searchType === 'framework') {
                    // means just remove the framework query                   
                    params.delete('fq');
                    fqParams.forEach((fp: any, fidx: number) => {
                        if (fidx === 0) {
                            params.set('fq', fp);
                        } else {
                            params.append('fq', fp);
                        }
                    });

                } else {
                    params.delete('fq');
                    params.set('fq', 'id.table_s:table.docindex');
                    params.delete('q');
                    params.set('q', '*:*');
                }
            }
        }

        if (update) {
            this._searchState.updateState(params);
        }
        return params;
    }



    get(newParams?: any[], searchType?: any) {
        const params = this.setParams(newParams, searchType, true);
        console.log('after set params', params);
        this.search(params).subscribe((results: any) => {
            this._resultStore.updateResults(results);
        });
    }

    getRecord(recordID: string): Observable<any[]> {
        const params = new URLSearchParams();
        params.set('q', 'id:' + recordID);
        params.set('facet', 'true');
        params.set('facet.query', 'Admin Boundaries');
        params.append('facet.query', 'Bioscience');
        params.append('facet.query', 'Cadastral');
        params.append('facet.query', 'Climate');
        params.append('facet.query', 'Coastal and Marine');
        params.append('facet.query', 'Elevation');
        params.append('facet.query', 'Geodetic Control');
        params.append('facet.query', 'Geoscience');
        params.append('facet.query', 'Hazards');
        params.append('facet.query', 'Preparedness');
        params.append('facet.query', 'Hydrography');
        params.append('facet.query', 'Imagery');
        params.append('facet.query', 'Land Use/Land Cover');
        params.append('facet.query', 'Transportation');
        params.append('facet.query', 'Utilities');
        params.append('facet.query', 'Reference');
        params.set('wt', 'json');
        params.set('json.wrf', 'JSONP_CALLBACK');
        return this.jsonp
            .get(this.SOLRURL, { search: params })
            .map(function (res: Response) {
                return res.json() || {};
            });
    }


    search(params: URLSearchParams): Observable<any[]> {
        return this.jsonp
            .get(this.SOLRURL, { search: params })
            .map(function (res: Response) {
                return res.json() || {};
            });
    }
}
