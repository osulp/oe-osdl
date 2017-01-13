import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-bar-cmp',
  templateUrl: './sort-bar-cmp.component.html',
  styleUrls: ['./sort-bar-cmp.component.css']
})
export class SortBarCmpComponent implements OnInit {
  @Output() onViewTypeChange = new EventEmitter();
  sortByArr:any = [];    
  selectedSortBy:any = {};
  viewType:any = 'tile';

  constructor() { }

  onSortByChange(selectedSort:any){
    console.log('selected sort is: ', selectedSort);
    this.selectedSortBy = selectedSort; 
  }

  toggleViewType(){
    this.viewType = this.viewType === 'tile' ? 'list' : 'tile';
    this.onViewTypeChange.emit(this.viewType);
  }

  ngOnInit() {
    this.sortByArr = [
    {val: 'Newest first'},
    {val: 'Oldest first'},
    {val: 'Title A-Z'},
    {val: 'Title Z-A'}
  ];
  this.onViewTypeChange.emit(this.viewType);
  }

}
