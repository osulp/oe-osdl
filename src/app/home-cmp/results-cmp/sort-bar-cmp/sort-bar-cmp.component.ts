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
  @Input() viewType: any;
  @Output() onViewTypeChange = new EventEmitter();
  @Output() onFrameworkOnlyChange = new EventEmitter();
  @Output() onSortChange = new EventEmitter();
  @Output() onShowNumChangeEvt = new EventEmitter();

  sortByArr = [
    { name: 'Newest first', val: 'osdl.pub_date_tdt desc, sys.src.item.lastmodified_tdt desc' },
    { name: 'Oldest first', val: 'osdl.pub_date_tdt asc, sys.src.item.lastmodified_tdt asc' },
    { name: 'Title A-Z', val: 'title_s asc' },
    { name: 'Title Z-A', val: 'title_s desc' }
  ];
  selectedSortBy = undefined;
  showNumberOpts = [{ val: '10' }, { val: '25' }, { val: '50' }, { val: '100' }];
  selectedShowNum: any;
  showFrameworkOnly: boolean = false;

  constructor() { }

  onSortByChange(selectedSort: any) {
    this.selectedSortBy = selectedSort;
    this.onSortChange.emit(selectedSort);
  }

  onShowNumChange(showNum: any) {
    this.onShowNumChangeEvt.emit(showNum);
  }

  refreshSort(selectedSort) {
    $('select[name=sortpicker]').val(this.sortByArr.filter(s => s.val === this.selectedSortBy)[0].name);
    const scope = this;
    window.setTimeout(() => {
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
    this.selectedSortBy = 'osdl.pub_date_tdt desc, sys.src.item.lastmodified_tdt desc';
  }

}
