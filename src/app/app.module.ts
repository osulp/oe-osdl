import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Router, Routes, NavigationStart } from '@angular/router';

import { AppComponent } from './app.component';
import { DetailsCmpComponent } from './details-cmp/details-cmp.component';
import { SearchCmpComponent } from './home-cmp/search-cmp/search-cmp.component';
import { HelpCmpComponent } from './help-cmp/help-cmp.component';
import { AboutCmpComponent } from './about-cmp/about-cmp.component';
import { FeedbackCmpComponent } from './feedback-cmp/feedback-cmp.component';
import { HomeCmpComponent } from './home-cmp/home-cmp.component';
import { ResultsCmpComponent } from './home-cmp/results-cmp/results-cmp.component';
import { ResultCmpComponent } from './home-cmp/results-cmp/result-cmp/result-cmp.component';
import { FacetsCmpComponent } from './home-cmp/results-cmp/facets-cmp/facets-cmp.component';
import { SortBarCmpComponent } from './home-cmp/results-cmp/sort-bar-cmp/sort-bar-cmp.component';
import { TitleBarCmpComponent } from './details-cmp/title-bar-cmp/title-bar-cmp.component';
import { DescInfoCmpComponent } from './details-cmp/desc-info-cmp/desc-info-cmp.component';
import {
  OsdlSolrSrvService,
  ResultsStoreSrvService,
  SearchStateSrvService,
  FacetsStoreSrvService,
  GetMapServicesMetadataSrvService
} from './services/index';
import { ResourcesCmpComponent } from './resources-cmp/resources-cmp.component';
import { PaginationDirective } from './directives/pagination.directive';
import { PagerCmpComponent } from './home-cmp/results-cmp/pager-cmp/pager-cmp.component';
import { MapPreviewCmpComponent } from './map-preview-cmp/map-preview-cmp.component';
import { OsdlErrorHandler } from './osdl-error-handler';
import { DownloadCmpComponent } from './download-cmp/download-cmp.component';
import { RestRedirectCmpComponent } from './rest-redirect-cmp/rest-redirect-cmp.component';
import { UtilitiesCls } from './utilities-cls';
import { CatalogResourceRedirectCmpComponent } from './catalog-resource-redirect-cmp/catalog-resource-redirect-cmp.component';

declare var ga: any;

const appRoutes: Routes = [
  { path: '', component: HomeCmpComponent },
  { path: 'home', component: HomeCmpComponent },
  { path: 'search', component: HomeCmpComponent },
  { path: 'about', component: AboutCmpComponent },
  { path: 'details', component: DetailsCmpComponent },
  { path: 'help', component: HelpCmpComponent },
  { path: 'feedback', component: FeedbackCmpComponent },
  { path: 'resources', component: ResourcesCmpComponent },
  { path: 'download', component: DownloadCmpComponent },
  { path: 'catalog/main/home.page', component: HomeCmpComponent },
  { path: 'GPT9/catalog/main/home.page', component: HomeCmpComponent },
  { path: 'rest/document', component: RestRedirectCmpComponent },
  { path: 'catalog/search/resource/details.page', component: CatalogResourceRedirectCmpComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchCmpComponent,
    DetailsCmpComponent,
    HelpCmpComponent,
    AboutCmpComponent,
    FeedbackCmpComponent,
    HomeCmpComponent,
    ResultsCmpComponent,
    ResultCmpComponent,
    FacetsCmpComponent,
    SortBarCmpComponent,
    TitleBarCmpComponent,
    DescInfoCmpComponent,
    ResourcesCmpComponent,
    PaginationDirective,
    PagerCmpComponent,
    MapPreviewCmpComponent,
    DownloadCmpComponent,
    RestRedirectCmpComponent,
    CatalogResourceRedirectCmpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    OsdlSolrSrvService,
    ResultsStoreSrvService,
    SearchStateSrvService,
    FacetsStoreSrvService,
    GetMapServicesMetadataSrvService,
    UtilitiesCls,
    { provide: ErrorHandler, useClass: OsdlErrorHandler }],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart && !window.location.href.includes('localhost')) {
        if (ga) {
          ga('send', 'pageview', window.location.href);
        }
      }
    });
  }
}
