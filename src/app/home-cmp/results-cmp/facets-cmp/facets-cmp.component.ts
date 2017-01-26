import { Component, Input, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { FacetAssocPipe } from '../../../pipes/facet-assoc.pipe';

@Component({
  selector: 'app-facets-cmp',
  templateUrl: './facets-cmp.component.html',
  styleUrls: ['./facets-cmp.component.css']
})
export class FacetsCmpComponent implements OnInit, OnChanges {
  @Input() solrFacets: any;
  facet_groups: any[] = [];
  constructor() { }

  ngOnInit() {
    ['Collections', 'Formats', 'Sources', 'Topics', 'Keywords'].forEach((facet: any) => {
      this.facet_groups.push({
        name: facet,
        expanded: facet === 'Topics',
        solrFields: facet === 'Collections' ? ['sys.src.collections_ss'] :
          facet === 'Formats' ? ['dataAccessType_ss'] :
            facet === 'Sources' ? ['contact.organizations_ss'] :
              facet === 'Keywords' ? ['keywords'] :
                facet === 'Topics' ? ['Admin Boundaries', 'Bioscience', 'Cadastral', 'Climate', 'Coastal and Marine', 'Elevation', 'Geodetic Control', 'Geoscience', 'Hazards', 'Preparedness', 'Hydrography', 'Imagery', 'Land Use/Land Cover', 'Transportation', 'Utilities', 'Reference'] :
                  []
      });
    });
  }

  ngOnChanges(change: any) {
    console.log('facet cmp seeing changes', change);
  }

}
