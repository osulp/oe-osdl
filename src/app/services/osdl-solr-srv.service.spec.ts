/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OsdlSolrSrvService } from './osdl-solr-srv.service';

describe('OsdlSolrSrvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OsdlSolrSrvService]
    });
  });

  it('should ...', inject([OsdlSolrSrvService], (service: OsdlSolrSrvService) => {
    expect(service).toBeTruthy();
  }));
});
