import { Component, Input, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { OsdlSolrSrvService, FacetsStoreSrvService, SearchStateSrvService } from '../../../services/index';
import { UtilitiesCls } from '../../../utilities-cls';

@Component({
  selector: 'app-facets-cmp',
  templateUrl: './facets-cmp.component.html',
  styleUrls: ['./facets-cmp.component.css']
})


export class FacetsCmpComponent implements OnInit, OnChanges {
  @Input() solrFacets: any;
  @Input() searchParams: any;
  @Input() isMobile: boolean;
  facet_groups: any[] = [];
  selected_facets: any[] = [];
  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    private _facet_store_service: FacetsStoreSrvService,
    private _searchState: SearchStateSrvService,
    private _utilities: UtilitiesCls
  ) { }

  ngOnInit() {
    let facets = this._facet_store_service.getFacetStore();
    facets.groups.forEach((group: any) => {
      group.solrFields.forEach((facet: any) => {
        facet.selected = facet.selected !== undefined ? facet.selected : false;
      });
    });
    this.facet_groups = facets.groups;
    console.log('facet!!', facets);
  }

  getTopicQuery(topic) {
    return topic + ' OR ' + topic.replace(/\ /g, '') + '*';
  }

  checkSelected(input: any) {
    console.log('checked?', input);
  }

  updateFacet(facet: any) {
    if (facet && this.facet_groups) {
      this.facet_groups.forEach(group => {
        group.solrFields.forEach((sf: any) => {
          sf.selected = sf.facet === facet.facet ? facet.selected : sf.selected;
          if (sf.fields) {
            if (facet.facet) {
              sf.fields.forEach(sff => {
                const cleanFacet = facet.facet.split(':').length > 1
                  ? facet.facet.toString().split(':')[1].replace(/"/g, '').toLowerCase()
                  : facet.facet;
                sff.selected = (facet.facet
                  ? sff.field === cleanFacet
                    ? true
                    : false
                  : false);
              });
            }
          }
        });
      });
    }
  }

  showMoreLessFacetFields(facet, moreless) {
    const facetFieldLimit = 'f.' + facet.solrFields[0].facet + '.facet.limit';
    const searchState = this._searchState.getState();
    let newLimit = +this._searchState.getState().get(facetFieldLimit);
    newLimit = moreless === 'more' ? newLimit + 10 : newLimit - 10;
    searchState.set(facetFieldLimit, newLimit.toString());
    this._searchState.updateState(searchState);
    this._osdl_solr_service.get();
  }



  setSelectedFacets(facets: any[], searchType: any, updateState: boolean) {
    console.log('set FACETS', facets, searchType, updateState);
    facets.forEach((facet: any) => {
      // coming from url so need to wait to sync with facet_group get response
      const scope = this;
      window.setTimeout(() => {
        scope.updateFacet(facet);
      }, !updateState ? 100 : 0);
      // check selected_facets for value, if there remove, else add
      // facet.query = facet.query.split(' OR')[0];
      if (!facet.selected) {
        console.log('remove?',facet);
        this.selected_facets = this.selected_facets.filter((f: any) => {
          console.log('f facet',f,facet);
          return f.value.toLowerCase() !== (facet.type === 'facet' ?
            (facet.facet + ':"' + facet.query + '"').toLowerCase()
            : facet.query.toLowerCase());
        });
      } else if (facet.type === 'sort') {
        const sortFacet = this.selected_facets.filter(sf => sf.type === 'sort');
        if (sortFacet.length === 0) {
          this.selected_facets.push(
            {
              key: facet.key,
              value: facet.query,
              type: facet.type
            }
          );
        } else {
          this.selected_facets.forEach(sf => {
            if (sf.type === 'sort') {
              sf.value = facet.query;
            }
          });
        }
      } else {
        // check if not already selected for pop state "back button" situations.
        if (this.selected_facets.filter(sf => sf.value === (facet.type === 'facet'
          ? (facet.facet + ':"' + facet.query + '"')
          : facet.query)).length === 0) {
          if (facet.key === 'q') {
            // remove previous
            this.selected_facets = this.selected_facets.filter(sf => sf.key !== 'q');
          }
          this.selected_facets.push(
            {
              key: facet.key ? facet.key : 'fq',
              value: facet.type === 'facet'
                ? (facet.facet + ':"' + facet.query + '"')
                : facet.query,
              type: facet.type
            });
        }
      }
    });

    const qsParams = [];
    const facetQueries = this.selected_facets.filter(sf => ['query', 'facet', 'framework'].indexOf(sf.type) !== -1)
      .map(qf => qf.value).toString();
    if (facetQueries !== '') {
      qsParams.push({ key: 'fq', value: facetQueries });
    }
    const sortParams = this.selected_facets.filter(sf => sf.type === 'sort').map(qf => qf.value).toString();
    if (sortParams !== '') {
      qsParams.push({ key: 'sort', value: sortParams });
    }
    const textParams = this.selected_facets.filter(sf => sf.type === 'textquery').map(qf => qf.value).toString();
    if (textParams !== '') {
      qsParams.push({ key: 'q', value: textParams });
    }
    console.log('selected_facets',this.selected_facets);
    this._osdl_solr_service.get(this.selected_facets, searchType, updateState);

    if (updateState) {
      const newState = this.updateQueryStringParam(qsParams);
      window.history.pushState({}, '', newState);
    }
  }

  updateQueryStringParam(qsParams: any[]) {
    let baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
    baseUrl += baseUrl.includes('search') ? '' : 'search';
    let urlQueryString = decodeURI(location.pathname.replace(location.pathname.split(';')[0], '').replace('/search', ''));
    let allParams = '';

    for (let x = 0; x < qsParams.length; x++) {
      const newParam = qsParams[x].value === '' ? '' : qsParams[x].key + '=' + qsParams[x].value;
      // If the 'search' string exists, then build params from it
      if (urlQueryString) {
        const keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
          allParams = urlQueryString.replace(keyRegex, '$1' + newParam);
        } else { // Otherwise, add it to end of query string
          allParams = urlQueryString + (qsParams[x].value !== '' ? ';' : '') + newParam;
        }
      } else {
        const pathname = document.location.pathname;
        const keyRegex = new RegExp('([\;])' + qsParams[x].key + '([^;]*|[^,]*)');
        if (pathname.match(keyRegex) !== null) {
          allParams = pathname.replace(keyRegex, '$1' + newParam);
        } else {
          allParams = (qsParams[x].value !== '' ? ';' : '') + newParam;
        }
      }
      urlQueryString = allParams;
    }
    const returnVal = (baseUrl + allParams).replace('?&', '?');
    // returnVal = '<%= ENV %>' !== 'prod' ? returnVal.replace(new RegExp('\\.', 'g'), '%2E') : returnVal;;
    return returnVal;
  };

  ngOnChanges(change: any) {
    if (change.solrFacets) {
      console.log('facets',change.solrFacets);
      // tslint:disable-next-line:forin
      for (const ff in change.solrFacets.currentValue.facet_fields) {
        const facet_fields = change.solrFacets.currentValue.facet_fields[ff]
          .map((f: any, idx: number) => {
            if (idx % 2 === 0) {
              return {
                field: f,
                count: change.solrFacets.currentValue.facet_fields[ff][idx + 1],
                selected: this.selected_facets.filter(sf => sf.value.indexOf(f) !== -1).length > 0
              };
            }
          })
          .filter(f => f !== undefined);
        const updated_facet_groups = this;
        this.facet_groups.forEach((group: any) => {
          let hasResults = false;
          group.solrFields.forEach((sf: any) => {
            if (sf.facet === ff) {
              sf.fields = facet_fields;
            } else {
              sf.facet_no_space = sf.facet.replace(/\ /g, '');
              sf.service_lookup = this._utilities.getServiceFilterQuery(sf.facet);
            }
            hasResults = sf.fields ? sf.fields.length > 0 ? true : hasResults : hasResults;
          });
          group.hasResults = group.name === 'Topics' ? true : hasResults;
        });
      }
    }
  }
}
