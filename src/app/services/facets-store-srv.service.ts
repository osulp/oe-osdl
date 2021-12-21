import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class FacetsStoreSrvService {

  facets = {
    'groups': [{
      'name': 'Collections',
      'expanded': false,
      'solrFields': [
        { 'facet': 'sys.src.collections_ss' }
      ]
    },
    {
      'name': 'Formats',
      'expanded': false,
      'removed': { 'facet': 'contentType_ss' },
      'solrFields': [
        { 'facet': 'dataAccessType_ss' }
      ]
    },
    {
      'name': 'Sources',
      'expanded': false,
      'solrFields': [
        { 'facet': 'contact.organizations_ss' }
      ]
    },
    {
      'name': 'Topics',
      'expanded': true,
      'solrFields': [
        { 'facet': 'Admin Boundaries', 'query': 'Admin?Boundaries OR AdminBoundaries* OR *Admin_Bounds*' },
        { 'facet': 'Bioscience', 'query': 'Bioscience OR Bioscience* OR *Bio*' },
        { 'facet': 'Cadastral', 'query': 'Cadastral OR Cadastral* OR *Cadastral*' },
        { 'facet': 'Climate', 'query': 'Climate OR Climate*' },
        { 'facet': 'Coastal and Marine', 'query': 'Coastal OR Marine OR CoastalandMarine*' },
        { 'facet': 'Elevation', 'query': 'Elevation OR Elevation* OR *LiDAR*' },
        { 'facet': 'Geodetic Control', 'query': 'Geodetic Control OR GeodeticControl*' },
        { 'facet': 'Geoscience', 'query': 'Geoscience OR Geoscience*' },
        { 'facet': 'Hazards', 'query': 'Hazards OR Hazards*' },
        { 'facet': 'Hydrography', 'query': 'Hydrography OR Hydrography*' },
        { 'facet': 'Imagery', 'query': 'OregonImagery OR OregonImagery*' },
        { 'facet': 'Land Use Land Cover', 'query': 'Land*Use Land*Cover OR LandUseLandCover*' },
        { 'facet': 'Preparedness', 'query': 'Preparedness OR Preparedness*' },
        { 'facet': 'Reference', 'query': 'Reference OR Reference*' },
        { 'facet': 'Transportation', 'query': 'Transportation OR Transportation*' },
        { 'facet': 'Utilities', 'query': 'Utilities OR Utilities*' }
      ]
    },
    {
      'name': 'Keywords',
      'expanded': false,
      'solrFields': [
        { 'facet': 'keywords_ss' }
      ]
    }
    ]
  };

  constructor(private http: Http) { }

  getFacetStore(){
    return this.facets;
  }

}
