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
      console.log('got the facet store info', results);
      this.facet_groups = results.groups;
    });
  }

  setSelectedFacets(facet: any) {
    // check selected_facets for value, if there remove, else add    
    if (!facet.selected) {
      this.selected_facets = this.selected_facets.filter((f: any) => {
        return  f.value !== (facet.type === 'facet' ? 
        facet.facet + ':"' + facet.query + '"'
        : facet.query );
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
  }

}
