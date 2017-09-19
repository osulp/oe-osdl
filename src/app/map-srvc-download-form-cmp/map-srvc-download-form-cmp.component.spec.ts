/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapSrvcDownloadFormCmpComponent } from './map-srvc-download-form-cmp.component';

describe('MapSrvcDownloadFormCmpComponent', () => {
  let component: MapSrvcDownloadFormCmpComponent;
  let fixture: ComponentFixture<MapSrvcDownloadFormCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSrvcDownloadFormCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSrvcDownloadFormCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
