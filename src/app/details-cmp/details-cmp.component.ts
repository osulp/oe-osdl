import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { OsdlSolrSrvService } from '../services/index';


@Component({
  selector: 'app-details-cmp',
  templateUrl: './details-cmp.component.html',
  styleUrls: ['./details-cmp.component.css']
})
export class DetailsCmpComponent implements OnInit {
  record: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _osdl_search_service: OsdlSolrSrvService
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.route.params
      // (+) converts string 'id' to a number
      .switchMap((params: Params) => this._osdl_search_service.getRecord(params['id']))
      .subscribe((rec: any) => {
        console.log('rec', rec);
        this.record = rec;
      });
  }
}
