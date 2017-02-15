import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-sort-bar-cmp',
  templateUrl: './sort-bar-cmp.component.html',
  styleUrls: ['./sort-bar-cmp.component.css']
})
export class SortBarCmpComponent implements OnInit {
  @Input() numRecords: any;
  @Input() sort: any;
  @Output() onViewTypeChange = new EventEmitter();
  @Output() onFrameworkOnlyChange = new EventEmitter();
  @Output() onSortChange = new EventEmitter();

  sortByArr = [
    { name: 'Newest first', val: 'sys.src.item.lastmodified_tdt desc' },
    { name: 'Oldest first', val: 'sys.src.item.lastmodified_tdt asc' },
    { name: 'Title A-Z', val: 'title asc' },
    { name: 'Title Z-A', val: 'title desc' }
  ];
  selectedSortBy = undefined;
  viewType: any = 'tile';
  showFrameworkOnly: boolean = false;

  constructor() { }

  onSortByChange(selectedSort: any) {
    console.log('selected sort is: ', selectedSort, this.sortByArr);
    this.selectedSortBy = selectedSort;
    this.onSortChange.emit(selectedSort);
  }

  refreshSort(selectedSort) {
    $('select[name=sortpicker]').val(this.sortByArr.filter(s => s.val === this.selectedSortBy)[0].name);
    const scope = this;
    window.setTimeout(() => {
      //console.log('selectdisplay', $('.bootstrap-select').css('display'));
      $('select[name=sortpicker]').selectpicker('refresh');
      if ($('.bootstrap-select').css('display') === undefined) {
        $('select[name=sortpicker]').selectpicker('refresh');
      }
    }, 100);

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
    this.selectedSortBy = 'sys.src.item.lastmodified_tdt desc';
    this.onViewTypeChange.emit(this.viewType);
  }

}
