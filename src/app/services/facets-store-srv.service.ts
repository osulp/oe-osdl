import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class FacetsStoreSrvService {

  facets = {
    "groups": [{
      "name": "Collections",
      "expanded": false,
      "solrFields": [
        { "facet": "sys.src.collections_ss" }
      ]
    },
    {
      "name": "Formats",
      "expanded": false,
      "removed": { "facet": "contentType_ss" },
      "solrFields": [
        { "facet": "dataAccessType_ss" }
      ]
    },
    {
      "name": "Sources",
      "expanded": false,
      "solrFields": [
        { "facet": "contact.organizations_ss" }
      ]
    },
    {
      "name": "Topics",
      "expanded": true,
      "solrFields": [
        { "facet": "Admin Boundaries" },
        { "facet": "Bioscience" },
        { "facet": "Cadastral" },
        { "facet": "Climate" },
        { "facet": "Coastal and Marine" },
        { "facet": "Elevation" },
        { "facet": "Geodetic Control" },
        { "facet": "Geoscience" },
        { "facet": "Hazards" },
        { "facet": "Hydrography" },
        { "facet": "Imagery" },
        { "facet": "Land Use Land Cover" },
        { "facet": "Preparedness" },
        { "facet": "Reference" },
        { "facet": "Transportation" },
        { "facet": "Utilities" }
      ]
    },
    {
      "name": "Keywords",
      "expanded": false,
      "solrFields": [
        { "facet": "keywords_ss" }
      ]
    }
    ]
  };

  constructor(private http:Http) { }

  getFacetStore(){
    return this.facets;
  }

}
