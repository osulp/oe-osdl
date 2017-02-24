import { Component, Input, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { OsdlSolrSrvService, FacetsStoreSrvService } from '../../../services/index';

@Component({
  selector: 'app-facets-cmp',
  templateUrl: './facets-cmp.component.html',
  styleUrls: ['./facets-cmp.component.css']
})


export class FacetsCmpComponent implements OnInit, OnChanges {
  @Input() solrFacets: any;
  @Input() searchParams: any;
  facet_groups: any[] = [];
  selected_facets: any[] = [];
  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    private _facet_store_service: FacetsStoreSrvService
  ) { }

  ngOnInit() {
    this._facet_store_service.getFacetStore().subscribe((results: any) => {
      results.groups.forEach((group: any) => {
        group.solrFields.forEach((facet: any) => {
          facet.selected = false;
        });
      });
      this.facet_groups = results.groups;
    });
  }

  getTopicQuery(topic) {
    return topic + ' OR ' + topic.replace(/\ /g, '') + '*';
  }

  checkSelected(input: any) {
    console.log('checked?', input);
  }

  updateFacet(facet: any) {
    // console.log('facet_groups', this.facet_groups);
    if (facet) {
      this.facet_groups.forEach(group => {
        group.solrFields.forEach((sf: any) => {
          console.log('select facets based on input:', facet.facet, sf);
          sf.selected = facet.facet
            ? facet.facet.includes(sf.facet.replace(' and ', ' OR '))
              ? facet.selected
              : sf.selected
            : sf.selected;
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

  setSelectedFacets(facets: any[], searchType: any, updateState: boolean) {
    console.log('set FACETS', facets, searchType, updateState);
    // this.selected_facets = [];
    facets.forEach((facet: any) => {
      // coming from url so need to wait to sync with facet_group get response
      const scope = this;
      window.setTimeout(() => {
        scope.updateFacet(facet);
      }, !updateState ? 100 : 0);
      // check selected_facets for value, if there remove, else add    
      facet.query = facet.query.split(' OR')[0];
      console.log('facet selected', facet);
      if (!facet.selected) {
        this.selected_facets = this.selected_facets.filter((f: any) => {
          console.log('facet selected check', f, facet);
          return f.value.toLowerCase() !== (facet.type === 'facet' ?
            (facet.facet + ':"' + facet.query + '"').toLowerCase()
            : facet.query.replace('Coastal Marine', 'Coastal and Marine').toLowerCase());
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
      } else if (facet.type === 'show') {

      } else {
        // check if not already selected for pop state "back button" situations.
        if (this.selected_facets.filter(sf => sf.value === (facet.type === 'facet'
          ? (facet.facet + ':"' + facet.query + '"')
          : facet.query)).length === 0) {
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

    console.log('selected facets set', this.selected_facets, searchType);
    this._osdl_solr_service.get(this.selected_facets, searchType, updateState);

    if (updateState) {
      const newState = this.updateQueryStringParam(qsParams);
      // console.log('NEW STATE TOPICs!!!!!!!!!!!', newState);
      window.history.pushState({}, '', newState);
    }
  }

  updateQueryStringParam(qsParams: any[]) {
    let baseUrl = [location.protocol, '//', location.host, location.pathname.split(';')[0]].join('');
    baseUrl += baseUrl.includes('search') ? '' : 'search';
    // console.log('baseUrl', baseUrl, qsParams);
    let urlQueryString = decodeURI(location.pathname.replace(location.pathname.split(';')[0], '').replace('/search', ''));
    // console.log('url query string', urlQueryString);
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
    // console.log('facet cmp seeing changes', change);
    if (change.solrFacets) {
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
        // console.log('facet_fields', facet_fields);
        const updated_facet_groups = this;
        this.facet_groups.forEach(group => group.solrFields.forEach((sf: any) => {
          if (sf.facet === ff) {
            sf.fields = facet_fields;
          } else {
            sf.facet_no_space = sf.facet.replace(/\ /g, '');
          }
        }));
      }
      // change.solrFacets.currentValue.
      // console.log('this.facet_groups', this.facet_groups);
    }
  }

}
