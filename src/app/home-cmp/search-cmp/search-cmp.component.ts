import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    public _osdl_solr_service: OsdlSolrSrvService,
    public _results_store_service: ResultsStoreSrvService
  ) { }

  inputSearchClickHandler(event: any) {
    this.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
    this.searchString = '';
  }

  searchByText(event?: any) {
    this.searchPushed = true;
    const filterFacet = {
      key: 'q',
      query: (this.searchString ? '*' + this.searchString + '*' : ''),
      type: 'textquery',
      selected: true
    };
    this.onTextFilterChange.emit(filterFacet);
  }

  selectResult(searchItem: any) {
    this.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
    this.searchString = '';
  }

  inputKeypressHandler(event: any) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      const scope = this;
      if (this.tempTabIndex !== -1) {
        this.router.navigate(['/details', { id: this.temp_search_results[this.tempTabIndex].id }]);
      } else {
        window.setTimeout(function () {
          scope.searchByText();
          scope.searchString = '';
        }, 200);
      }
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
      if ($('.tabHover').length > 0) {
        $('.tabHover')[0].scrollIntoView(false);
      }
    }, 100);
  }

  blurHandler(event: any) {
    const searchScope = this;
    if (!this.searchPushed) {
      setTimeout(function () {
        // if tabbing on list result set input box to match the Name property, but don't clear.
        if (['list-group-item', 'search-btn', 'download-link-a'].indexOf(document.activeElement.classList.toString()) === -1) {
          searchScope.searchTerm.setValue('', { emitEvent: true, emitModelToViewChange: true });
          searchScope.searchString = '';
        }
      }, 1);
    }
    event.preventDefault();
  }
  eventHandler(event: any, searchItem: any) {
    this.router.navigate(['/details', { id: searchItem.id }]);
  }

  filterLookup(filter: string) {
    let returnCategory = '';
    switch (true) {
      case filter.includes('collections'):
        returnCategory = 'Collection: ';
        break;
      case filter.includes('dataAccessType'):
        returnCategory = 'Format: ';
        break;
      case filter.includes('organizations'):
        returnCategory = 'Source: ';
        break;
      case filter.includes('*ramework'):
        returnCategory = '';
        break;
      case filter.includes('keywords'):
        returnCategory = 'Keyword: ';
        break;
      default:
        returnCategory = 'Topic: ';
        break;
    }
    return returnCategory.toUpperCase();
  }

  processFilters(params: any) {
    console.log('processing filters', params);
    this.filters = [];
    // process faceted additions, skipping first for all docs
    if (params.fq.constructor === Array) {
      params.fq.forEach((f: string, idx: number) => {
        if (idx !== 0) {
          const filter: any = {};
          if (f.includes(':')) {
            filter.facet = f
              .split(':')[1]
              .replace(/"/g, '')
              .replace(/\*/g, '');
            filter.query = f;
            filter.category = this.filterLookup(f);
            console.log('passport',f,filter);
            filter.type = f.includes('ramework') ? 'framework' : 'facets';
          } else {
            filter.facet = f
              .split(' OR')[0]
              .replace(/"/g, '')
              .replace(/\*/g, '')
              .replace('Coastal Marine', 'Coastal and Marine')
              .replace('LandUse LandCover', 'Land Use Land Cover')
              .replace('?', ' ');
            filter.query = f;
            filter.category = this.filterLookup(f);
            filter.type = 'query';
          }
          this.filters.push(filter);
        }
      });
    }
    if (params.q !== '*:*') {
      const textFilter: any = {};
      textFilter.facet = params.q
        .replace(/"/g, '')
        .replace(/\*/g, '');
      textFilter.query = params.q;
      textFilter.category = 'search keyword: ';
      textFilter.type = 'textquery';
      this.filters.push(textFilter);
    }
  }

  removeFilter(filter: any) {
    console.log('removing filter', filter);
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
        if (!this.initLoad && term !== '') {
          return this._osdl_solr_service.textSearch([{
            key: 'q',
            value: (term
              ? '"*' + term.toString() + '*"'
              : '*:*'),
            type: 'textquery'
          }], false);
        } else {
          this.initLoad = false;
          return [];
        }
      });

    this.items.subscribe(value => this.temp_search_results = value);


    this._results_store_service.selectionChanged$.subscribe(
      results => {
        this.solr_results = results;
        if (results.responseHeader) {
          this.processFilters(results.responseHeader.params);
        }
      },
      err => console.log(err),
      () => console.log('done with subscribe event results store selected')
    );
  }
}

