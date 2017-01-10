/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacetsCmpComponent } from './facets-cmp.component';

describe('FacetsCmpComponent', () => {
  let component: FacetsCmpComponent;
  let fixture: ComponentFixture<FacetsCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetsCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetsCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
