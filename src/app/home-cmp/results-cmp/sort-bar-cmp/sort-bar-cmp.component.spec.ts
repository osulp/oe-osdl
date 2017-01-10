/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SortBarCmpComponent } from './sort-bar-cmp.component';

describe('SortBarCmpComponent', () => {
  let component: SortBarCmpComponent;
  let fixture: ComponentFixture<SortBarCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortBarCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortBarCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
