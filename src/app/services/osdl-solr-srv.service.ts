import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResultsStoreSrvService} from './results-store-srv.service';
import { SearchStateSrvService} from './search-state-srv.service';
import { FacetsStoreSrvService} from './facets-store-srv.service';
import { UtilitiesCls } from '../utilities-cls';

declare var ga: any;

@Injectable()
export class OsdlSolrSrvService {
    SOLRURL: string = 'https://solr1.library.oregonstate.edu/solr/geoportal/select';
    facets: any = [];

    constructor(
        private jsonp: Jsonp,
        private _resultStore: ResultsStoreSrvService,
        private _searchState: SearchStateSrvService,
        private _utilities: UtilitiesCls,
        private _facets_store_service: FacetsStoreSrvService
    ) {}

    setBaseSearchState() {
        this._searchState.setBaseSearchState();
    }

    textSearch(newParams?: any[], update?: boolean): Observable<any[]> {
        const params = this.setParams(newParams, 'textquery', update);
        console.log('frantisek params', params);
        return this.jsonp
            .get(this.SOLRURL, { search: params })
            .map(function (res: Response) {
                console.log('frantisek?', res.json().response.docs);
                return res.json().response.docs || {};
            });
    }

    setParams(newParams: any[], searchType: any, update?: boolean) {
        console.log('setting params', newParams, searchType, update);
        const frameworkQuery = 'keywords_ss:*ramework OR title:*ramework*';
        let params: URLSearchParams = this._searchState.getState();
        params.delete('defType');
        // get state param types to catch remove
        const fqParams = params.getAll('fq').filter(p => p !== frameworkQuery && p !== 'keywords_ss:*ramework');
        const qParams = params.getAll('q');
        if (update) {
            params.set('start', '0');
        }

        if (newParams) {
            if (newParams.length > 0) {
                const new_q_params = newParams.filter(np => np.type === 'textquery');
                const new_fq_params = newParams.filter(nfq => ['facets', 'facet', 'query'].indexOf(nfq.type) !== -1);
                const new_framework_param = newParams.filter(fp => fp.type === 'framework');

                const remove_fq = fqParams.length > new_fq_params.length;
                const remove_q = qParams.length > new_q_params.length;

                let fqCounter = 0;
                // console.log('finner',newParams);
                newParams.forEach((p: any, idx: number) => {
                    // console.log('fin',p);
                    if (p.type) {
                        // console.log('p has type');
                        p.value = p.value.includes('keywords:') && !p.value.includes('"')
                            ? p.value.split(':')[0] + ':"' + p.value.split(':')[1] + '"'
                            : p.value;
                        switch (p.type) {
                            case 'textquery':
                                params.delete('q');
                                params.set('q', p.value === '' ? '*:*' : p.value);
                                params.set('defType', 'dismax');
                                // params.set('qf', 'title_s^4 keywords_ss^2 description^.2 contact.organizations_ss');
                                break;
                            case 'facets':
                            case 'facet':
                            case 'query':
                                if (fqCounter === 0) {
                                    params.delete('fq');
                                    params.set('fq', 'id.table_s:table.docindex');
                                }
                                params.append(p.key, p.value.trim());
                                fqCounter++;
                                break;
                            case 'sort':
                                params.delete('sort');
                                params.set('sort', p.value);
                                break;
                            case 'framework':
                                if (params.getAll('fq').length > 0) {
                                    params.append(p.key, frameworkQuery);
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
                    // console.log('removing q');
                    params.delete('q');
                    params.set('q', '*:*');
                }
                if (remove_fq) {
                    // check framework
                    if (new_fq_params.length === 0) {
                        params.delete('fq');
                        params.set('fq', 'id.table_s:table.docindex');
                        if (new_framework_param.length === 1) {
                            params.append('fq', frameworkQuery);
                        }
                    }
                }
                if (new_framework_param.length === 1
                    && params.getAll('fq').filter(fq => fq === frameworkQuery || fq === 'keywords_ss:*ramework').length === 0) {
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
        // check if framework then set to specifics queries
        const isFramework = params.getAll('fq').filter(fq => fq.includes('ramework*')).length > 0;
        if (isFramework) {
            params = this.setFrameworkParams(params);
        }

        if (update) {
            this._searchState.updateState(params);
        }
        // console.log('after param set', params);
        return params;
    }

    setFrameworkParams(params: URLSearchParams) {
        // console.log('need to process params', params);
        // const fqParams = params.getAll('fq');
        // params.delete('fq');
        // params.set('fq', 'id.table_s:table.docindex');
        // fqParams.forEach(fq => {
        //     if (!fq.includes(':')) {
        //         params.append('fq', fq);
        //         const fqQuery = 'keywords_ss:'
        //             + fq.split(' OR ')[fq.split(' OR ').length - 1]
        //                 .substring(0, (fq.split(' OR ')[fq.split(' OR ').length - 1]).length - 1)
        //                 .replace('*', '')
        //                 .replace('Admin_Bounds', 'AdminBoundaries')
        //             + '*ramework OR title:*ramework';
        //         params.append('fq', fqQuery);
        //         console.log('fq query', fqQuery);
        //     }
        // });

        return params;
    }

    pager(start: any, rows: any) {
        const params: URLSearchParams = this._searchState.getState();
        // console.log('pager check', params);
        // check if rows changed, if so set start back to 0
        params.delete('start');
        params.set('start', params.get('rows') !== rows.toString() ? '0' : start.toString());
        params.delete('rows');
        params.set('rows', rows.toString());
        this._searchState.updateState(params);
        // console.log('pager check', params);
        this.search(params).subscribe((results: any) => {
            this._resultStore.updateResults(results);
        });
    }

    get(newParams?: any[], searchType?: any, update?: boolean) {
        const params = this.setParams(newParams, searchType, update);
        this.search(params).subscribe((results: any) => {
            if (results.responseHeader) {
                this._resultStore.updateResults(results);
            } else {
                if (!window.location.href.includes('localhost')) {
                    if (ga) {
                        ga('send', 'event', {
                            eventCategory: 'Failed search',
                            eventAction: 'search',
                            eventLabel: window.location.href,
                            transport: 'beacon'
                        });
                    }
                }
            }
        });
    }

    getRecord(recordID: string): Observable<any[]> {
        const params = new URLSearchParams();
        params.set('q', 'id:' + recordID);
        params.set('facet', 'true');
        this.facets = this._facets_store_service.getFacetStore();
        this.facets.groups.forEach(fg => {
            if (fg.name === 'Topics'){
                fg.solrFields.forEach((f, idx) => {
                    if (idx === 0){
                        params.set('facet.query', f.query);
                    } else {
                        params.append('facet.query', f.query);
                    }
                });
            }
        });
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
