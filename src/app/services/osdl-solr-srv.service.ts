import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResultsStoreSrvService } from './results-store-srv.service';
import { SearchStateSrvService } from './search-state-srv.service';

@Injectable()
export class OsdlSolrSrvService {
    SOLRURL: string = 'http://lib-solr1.library.oregonstate.edu:8984/solr/geoportal/select';

    constructor(
        private jsonp: Jsonp,
        private _resultStore: ResultsStoreSrvService,
        private _searchState: SearchStateSrvService
    ) { }

    setBaseSearchState() {
        this._searchState.setBaseSearchState();
    }

    get(newParams?: any[], searchType?: any) {
        const params: URLSearchParams = this._searchState.getState();

        // let params = baseParams ? new URLSearchParams(JSON.stringify(baseParams)) : this._baseParams;
        console.log('get check',params, searchType, newParams);
        if (searchType) {
            switch (searchType) {
                case 'facets':
                    // check for framework before deleting
                    const hasFramework = params.getAll('fq').filter((p: any) => p === 'keywords_ss:*Framework').length > 0;
                    params.delete('fq');
                    newParams.forEach((p: any, idx: number) => {
                        if (idx === 0) {
                            params.set('fq', 'id.table_s:table.docindex');
                        }
                        params.append(p.key, p.value);
                    });
                    if (newParams.length === 0) {
                        params.set('fq', 'id.table_s:table.docindex');
                    }
                    if (hasFramework) {
                        params.append('fq', 'keywords_ss:*Framework');
                    }
                    break;
                case 'textquery':
                    break;
                case 'sort':
                    params.delete('sort');
                    params.set('sort',newParams[0].value);
                    break;
                case 'framework':
                    if (newParams.length > 0) {
                        params.append(newParams[0].key, newParams[0].value);
                    } else {
                        //need to remove                        
                        const facetParams = params.getAll('fq').filter((p: any) => p !== 'keywords_ss:*Framework');
                        params.delete('fq');
                        facetParams.forEach((fp: any, idx: number) => {
                            if (idx === 0) {
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
        this._searchState.updateState(params);
        this.search(params).subscribe((results: any) => {
            this._resultStore.updateResults(results);
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
