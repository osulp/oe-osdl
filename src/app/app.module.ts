import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

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
import { OsdlSolrSrvService, ResultsStoreSrvService } from './services/index';
import { ResourcesCmpComponent } from './resources-cmp/resources-cmp.component';
import { FacetAssocPipe } from './pipes/facet-assoc.pipe';

const appRoutes: Routes = [
  { path: '', component: HomeCmpComponent },
  { path: 'about', component: AboutCmpComponent },
  { path: 'details', component: DetailsCmpComponent },
  { path: 'help', component: HelpCmpComponent },
  { path: 'feedback', component: FeedbackCmpComponent },
  { path: 'resources', component: ResourcesCmpComponent }
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
    FacetAssocPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [OsdlSolrSrvService, ResultsStoreSrvService],
  bootstrap: [AppComponent]

})
export class AppModule { }
