import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog-resource-redirect-cmp',
  templateUrl: './catalog-resource-redirect-cmp.component.html',
  styleUrls: ['./catalog-resource-redirect-cmp.component.css']
})
export class CatalogResourceRedirectCmpComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('details url', location);
    // get the uuid
    const uuid = location.href.split('uuid=').length > 1 ? location.href.split('uuid=')[1] : '';
    if (uuid !== '') {
      this.router.navigate(['/details', {
        id: decodeURI(uuid)
          .replace('{', '')
          .replace('}', '')
          .replace(/\-/g, '')
          .toLocaleLowerCase()
      }]);
    } else {
      this.router.navigate(['/']);
    }
  }

}
