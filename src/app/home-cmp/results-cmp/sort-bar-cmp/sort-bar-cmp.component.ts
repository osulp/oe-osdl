import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-bar-cmp',
  templateUrl: './sort-bar-cmp.component.html',
  styleUrls: ['./sort-bar-cmp.component.css']
})
export class SortBarCmpComponent implements OnInit {
  @Input() numRecords: any;
  @Output() onViewTypeChange = new EventEmitter();
  @Output() onFrameworkOnlyChange = new EventEmitter();
  @Output() onSortChange = new EventEmitter();
  sortByArr: any = [];
  selectedSortBy: any = {};
  viewType: any = 'tile';
  showFrameworkOnly: boolean = false;

  constructor() { }

  onSortByChange(selectedSort: any) {
    //console.log('selected sort is: ', selectedSort);    
    this.selectedSortBy = selectedSort;
    this.onSortChange.emit(selectedSort);
  }

  toggleFrameworkOnly(chkShowFramework) {
    this.showFrameworkOnly = chkShowFramework;
    this.onFrameworkOnlyChange.emit(this.showFrameworkOnly);
  }

  toggleViewType() {
    this.viewType = this.viewType === 'tile' ? 'list' : 'tile';
    this.onViewTypeChange.emit(this.viewType);
  }

  ngOnInit() {
    this.sortByArr = [
      { val: 'Newest first', solrVal: 'sys.src.item.lastmodified_tdt desc' },
      { val: 'Oldest first', solrVal: 'sys.src.item.lastmodified_tdt asc' },
      { val: 'Title A-Z', solrVal: 'title asc' },
      { val: 'Title Z-A', solrVal: 'title desc' }
    ];
    this.onViewTypeChange.emit(this.viewType);
  }

}
