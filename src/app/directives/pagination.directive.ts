import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';
// import {NgIf, NgFor, NgClass} from "@angular/common";

@Component({
  selector: 'ng-pagination[ngModel]',
  templateUrl: './pagination.directive.html'
})
export class PaginationDirective implements ControlValueAccessor, OnChanges {
  @Input('previous-text') previousText: string;
  @Input('next-text') nextText: string;
  @Input('first-text') firstText: string;
  @Input('last-text') lastText: string;
  @Input('totalItems') totalItems: number;
  @Input('currentPage') cPage: number;
  @Input() itemsPerPage: number;
  @Input('maxSize') pageSize: number;
  @Input('boundaryLinks') boundaryLinks: boolean;
  @Output('pageChanged') pageChanged = new EventEmitter();
  currentpage: number;
  pageList: Array<number> = [];
  private onChange: Function;
  private onTouched: Function;
  private seletedPage: number;
  private nextItem: number;
  private previousItem: number;
  private nextItemValid: boolean;
  private previousItemValid: boolean;

  constructor(private pageChangedNgModel: NgModel) {
    this.pageChangedNgModel.valueAccessor = this;
  }

  ngOnChanges(change: any) {
    console.log('directive change', change);
    if (change.totalItems) {
      this.currentpage = this.seletedPage = 1;
    }
    this.doPaging();
  }

  doPaging() {
    console.log('doing paging', this.seletedPage, this.currentpage);
    this.pageList = [];
    let i: number, count: number;
    this.seletedPage = this.currentpage;
    const remaining = this.totalItems % this.itemsPerPage;
    const totalSize = ((this.totalItems - remaining) / this.itemsPerPage) + 1; // + (remaining === 0 ? 0 : 1);

    // want to get the range that this page is in
    let firstPageRangeVal = 1;
    const rangeArray = new Array(Math.ceil(totalSize / this.pageSize));
    for (let idx = 1; idx < rangeArray.length; idx++) {
      firstPageRangeVal = ((idx) * this.pageSize) <= this.currentpage - 1
        ? ((idx) * this.pageSize) + 1
        : firstPageRangeVal;
    }
    //console.log('doing paging2', this.currentpage, rangeArray, firstPageRangeVal);
    // for (i = (this.currentpage), count = 0; i <= totalSize && count < this.pageSize; i++ , count++) {
    //   this.pageList.push(i);
    // }
    for (i = (firstPageRangeVal), count = 0; i <= totalSize && count < this.pageSize; i++ , count++) {
      this.pageList.push(i);
    }
    console.log('page list',this.pageList,totalSize,this.pageSize);
    // next validation
    if (i - 1 < totalSize) {
      this.nextItemValid = true;
      this.nextItem = i;

    } else {
      this.nextItemValid = false;
    }
    // previous validation
    if (this.currentpage > this.pageSize) {
      this.previousItemValid = true;
      this.previousItem = (this.currentpage * this.pageSize) - 1;
    } else {
      this.previousItemValid = false;
    }
  }
  setCurrentPage(pageNo: number) {
    this.seletedPage = pageNo;
    this.pageChangedNgModel.viewToModelUpdate(pageNo);
    this.pageChageListner();
  }
  firstPage() {
    this.currentpage = 1;
    this.pageChangedNgModel.viewToModelUpdate(1);
    this.pageChageListner();
    this.doPaging();
  }
  lastPage() {
    // console.log('last page',this.totalItems,this.pageSize, this.pageList);
    const totalPages = Math.floor(this.totalItems / this.itemsPerPage);
    console.log('last page', this.totalItems, this.pageSize, totalPages);
    const lastPage = (totalPages) - (totalPages % this.pageSize === 0 ? this.pageSize : totalPages % this.pageSize) + 1;
    this.currentpage = lastPage;
    this.pageChangedNgModel.viewToModelUpdate(lastPage);
    this.pageChageListner();
    this.doPaging();
  }
  nextPage(pageNo: number) {
    this.currentpage = pageNo;
    this.pageChangedNgModel.viewToModelUpdate(pageNo);
    this.pageChageListner();
    this.doPaging();
  }
  previousPage(pageNo: number) {
    console.log('prev page', pageNo);
    const temp = pageNo - (this.pageSize + 1);
    this.currentpage = temp > 0 ? temp : 1;
    this.pageChangedNgModel.viewToModelUpdate(this.currentpage);
    this.pageChageListner();
    this.doPaging();
  }
  writeValue(value: string): void {
    if (!value && value !== '0') { return; }
    this.setValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }
  setValue(currentValue: any) {
    this.currentpage = currentValue;
    this.doPaging();
  }
  pageChageListner() {
    this.pageChanged.emit({
      itemsPerPage: this.currentpage
    });
  }
}