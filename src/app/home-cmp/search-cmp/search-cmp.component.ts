import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OsdlSolrSrvService, ResultsStoreSrvService } from '../../services/index';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'app-search-cmp',
  templateUrl: './search-cmp.component.html',
  styleUrls: ['./search-cmp.component.css']
})

export class SearchCmpComponent implements OnInit {
  @Output() onTextFilterChange = new EventEmitter();
  isHandheld: boolean = $(window).width() < 768;
  temp_search_results: any = [];
  searchTerm = new FormControl();
  searchString: string;
  items: Observable<any>;
  solr_results: any;
  selectedSearchResult: {};
  filters: any[] = [];
  tempTabIndex: number = -1;
  searchPushed: boolean = false;
  initLoad: boolean = true;

  constructor(
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  inputSearchClickHandler(event: any) {
    this.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
    this.searchString = '';
  }

  searchByText(event?: any) {
    this.searchPushed = true;
    console.log('search pushed', this.searchString);
    const filterFacet = {
      key: 'q',
      query: (this.searchString ? '"*' + this.searchString + '*"' : ''),
      type: 'textquery',
      selected: true
    }

    this.onTextFilterChange.emit(filterFacet);

    // this._osdl_solr_service.get([{ key: 'q', value: (this.searchString ? '"*' + this.searchString + '*"' : '') }, 'textquery']);
    // if (this.searchTerms !== '') {
    //     this._router.navigate(['Explore', { filter: this.searchTerms }]);
    // } else {
    //     this._router.navigate(['Explore']);
    // }        
  }

  selectResult(searchItem: any) {
    // this.selSearchResultEvt.emit(searchItem);
    this.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
    this.searchString = '';
  }

  inputKeypressHandler(event: any) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      const scope = this;
      window.setTimeout(function () {
        scope.searchByText();
        // scope.searchTerm.setValue('', { emitEvent: false, emitModelToViewChange: false });
        scope.searchString = '';
      }, 200);

    } else if (code === 40 || code === 9) {
      // tab or down arro
      if (this.tempTabIndex !== this.temp_search_results.length) {
        this.tempTabIndex++;
      } else {
        this.tempTabIndex = 0;
      }
    } else if (code === 38) {
      // up arrow
      if (this.tempTabIndex !== -1) {
        this.tempTabIndex--;
      } else {
        this.tempTabIndex = 0;
      }
    } else {
      this.tempTabIndex = -1;
    }
    this.temp_search_results.forEach((result: any, idx: number) => {
      this.temp_search_results[idx].hovered = this.tempTabIndex === idx ? true : false;
    });
    if (code === 9) {
      event.preventDefault();
    }

    window.setTimeout(function () {
      // console.log('scrollintoview?', $('.tabHover'));
      if ($('.tabHover').length > 0) {
        $('.tabHover')[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    }, 100);

    // window.setTimeout(this.adjustListGroupTags, 500);
  }

  blurHandler(event: any) {
    const searchScope = this;
    console.log('blur', event);
    if (!this.searchPushed) {
      setTimeout(function () {
        searchScope.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
        searchScope.searchString = '';
        // if tabbing on list result set input box to match the Name property, but don't clear.
        // if (document.activeElement.classList.toString() === 'list-group-item') {
        //   const attr: any = 'data-search-item';
        //   const listItem: any = JSON.parse(document.activeElement.attributes[attr].value);
        //   const selected = {
        //     Name: listItem.Name.replace(/\,/g, '%2C').replace(/\./g, '%2E'),
        //     ResID: listItem.ResID,
        //     Type: listItem.Type,
        //     TypeCategory: listItem.TypeCategory,
        //     Desc: listItem.Desc
        //   };
        //   searchScope.selectedSearchResult = selected;
        //   // if the Explore button then select the top result and go else put focus on the input
        // } else if (document.activeElement.id === 'search-btn') {
        //   // get tempResult values
        //   if (searchScope.temp_search_results.length > 0) {
        //     const firstItem: any = searchScope.temp_search_results[searchScope.tempTabIndex];
        //     const selected = {
        //       Name: firstItem['Name'].replace(/\,/g, '%2C').replace(/\./g, '%2E'),
        //       ResID: firstItem['ResID'],
        //       Type: firstItem['Type'],
        //       TypeCategory: firstItem['TypeCategory'],
        //       Desc: firstItem['Desc']
        //     };
        //     searchScope.selectedSearchResult = selected;
        //     searchScope.selectResult(selected);
        //     alert(firstItem['Name']);
        //   } else {
        //     alert('Please select a valid search term.');
        //   }
        // } else {
        //   searchScope.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
        //   searchScope.searchString = '';
        // }
      }, 1);
    }
    // event.preventDefault();
  }
  eventHandler(event: any, searchItem: any) {
    // this.selectResult(searchItem);
    console.log('term selected', searchItem);
  }

  processFilters(params: any) {
    console.log('processing filters', params);
    this.filters = [];
    // process faceted additions, skipping first for all docs
    if (params.fq.constructor === Array) {
      params.fq.forEach((f: string, idx: number) => {
        if (idx !== 0) {
          // console.log('filter', f);
          const filter: any = {};
          if (f.includes(':')) {
            filter.facet = f.split(':')[1].replace(/"/g, '').replace(/\*/g, '');
            filter.query = f;
            filter.type = f.includes('Framework') ? 'framework' : 'facets';
          } else {
            filter.facet = f.replace(/"/g, '').replace(/\*/g, '');
            filter.query = f;
            filter.type = 'query';
          }
          this.filters.push(filter);
        }
      });
    }
    if (params.q !== '*:*') {
      const textFilter: any = {};
      textFilter.facet = params.q.replace(/"/g, '').replace(/\*/g, '');
      textFilter.query = params.q;
      textFilter.type = 'textquery';
      this.filters.push(textFilter);
    }
  }

  removeFilter(filter: any) {
    console.log('remove filter called', filter);
    filter.selected = false;
    this.onTextFilterChange.emit(filter);
  }

  clearFilters() {
    this.filters.forEach((filter: any) => {
      filter.selected = false;
      this.onTextFilterChange.emit(filter);
    });
  }

  ngOnInit() {
    this.items = this.searchTerm.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any) => {
        if (!this.initLoad) {
          return this._osdl_solr_service.textSearch([{
            key: 'q',
            value: (term ? '"*' + term.toString() + '*"' : ''),
            type: 'textquery'
          }, false]);
        } else {
          this.initLoad = false;
          return [];
        }
      });

    this.items.subscribe(value => this.temp_search_results = value);


    this._results_store_service.selectionChanged$.subscribe(
      results => {
        // console.log('store updated! in search cmp', results);
        this.solr_results = results;
        if (results.responseHeader) {
          this.processFilters(results.responseHeader.params);
        }
      },
      err => console.error(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}

