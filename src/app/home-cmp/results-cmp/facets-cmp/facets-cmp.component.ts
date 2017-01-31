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

  checkSelected(input: any) {
    console.log('checked?', input);
  }

  updateFacet(facet){
    this.facet_groups.forEach(group => group.solrFields.forEach((sf:any) => { 
      sf.selected = sf.facet === facet.facet ? facet.selected : sf.selected;
    }));
  }

  setSelectedFacets(facet: any) {
    console.log('set selected facets/filters',facet);
    this.updateFacet(facet);
    // check selected_facets for value, if there remove, else add    
    if (!facet.selected) {
      this.selected_facets = this.selected_facets.filter((f: any) => {
        return f.value !== (facet.type === 'facet' ?
          facet.facet + ':"' + facet.query + '"'
          : facet.query);
      });
    } else {
      this.selected_facets.push(
        {
          key: 'fq', value: facet.type === 'facet'
            ? (facet.facet + ':"' + facet.query + '"')
            : facet.query, type: facet.type
        });
    }

    this._osdl_solr_service.get(this.selected_facets, 'facets');
  }

  ngOnChanges(change: any) {
    console.log('facet cmp seeing changes', change);
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
        //console.log('facet_fields', facet_fields);
        const updated_facet_groups = this;
        this.facet_groups.forEach(group => group.solrFields.forEach((sf: any) => {
          if (sf.facet === ff) {
            sf.fields = facet_fields;
          }
        }));
      }
      //change.solrFacets.currentValue.
      console.log('this.facet_groups', this.facet_groups);
    }
  }

}
