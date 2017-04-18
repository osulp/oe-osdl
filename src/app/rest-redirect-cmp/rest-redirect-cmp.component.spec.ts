/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RestRedirectCmpComponent } from './rest-redirect-cmp.component';

describe('RestRedirectCmpComponent', () => {
  let component: RestRedirectCmpComponent;
  let fixture: ComponentFixture<RestRedirectCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestRedirectCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestRedirectCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
