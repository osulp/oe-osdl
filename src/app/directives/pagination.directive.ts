import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';

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
  private totalSize: number;

  constructor(private pageChangedNgModel: NgModel) {
    this.pageChangedNgModel.valueAccessor = this;
  }

  ngOnChanges(change: any) {
    if (change.totalItems) {
      this.currentpage = this.seletedPage = 1;
    }
    this.doPaging();
  }

  doPaging() {

    this.pageList = [];
    let i: number, count: number;
    this.seletedPage = this.currentpage;
    const remaining = this.totalItems % this.itemsPerPage;
    this.totalSize = ((this.totalItems - remaining) / this.itemsPerPage) + 1; // + (remaining === 0 ? 0 : 1);

    // want to get the range that this page is in
    let firstPageRangeVal = 1;
    const rangeArray = new Array(Math.ceil(this.totalSize / this.pageSize));
    for (let idx = 1; idx < rangeArray.length; idx++) {
      firstPageRangeVal = ((idx) * this.pageSize) <= this.currentpage - 1
        ? ((idx) * this.pageSize) + 1
        : firstPageRangeVal;
    }

    for (i = (firstPageRangeVal), count = 0; i <= this.totalSize && count < this.pageSize; i++ , count++) {
      this.pageList.push(i);
    }
    this.setPrevNext();
  }

  setCurrentPage(pageNo: number) {
    this.seletedPage = pageNo;
    this.currentpage = this.seletedPage;
    this.setPrevNext();
    this.pageChangedNgModel.viewToModelUpdate(pageNo);
    this.pageChageListner();
  }

  setPrevNext() {
    this.nextItemValid = this.currentpage + 1 < this.totalSize;
    this.nextItem = this.currentpage + 1;
    this.previousItemValid = this.currentpage - 1 > 0;
    this.previousItem = this.currentpage - 1;
  }

  firstPage() {
    this.currentpage = 1;
    this.pageChangedNgModel.viewToModelUpdate(1);
    this.pageChageListner();
    this.doPaging();
  }
  lastPage() {
    const totalPages = Math.floor(this.totalItems / this.itemsPerPage);
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
    const temp = pageNo - (this.pageSize + 1);
    this.currentpage = temp > 0 ? temp : 1;
    this.currentpage = pageNo;
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