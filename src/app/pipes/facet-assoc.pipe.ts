import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facetAssocPipe'
})
export class FacetAssocPipe implements PipeTransform {

  transform(value: any, osdlFacetGroup: any): any {
    console.log('pipe check',value,osdlFacetGroup);
    return value;
  }

}
