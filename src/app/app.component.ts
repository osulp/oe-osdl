import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeCmpComponent } from './home-cmp/home-cmp.component';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(HomeCmpComponent) homeCmp: HomeCmpComponent;
  isMobile: boolean = $(window).width() < 768;
  pageObj: any;
  counter: number = 0;

  constructor(
    //private router: Router
  ) { }

  goClearHome() {
    console.log('test');
    this.homeCmp.searchCmp.clearFilters();
    //this.router.navigate(['/']);
  }
  ngOnInit() {
    const windowScope = this;
    $(window).on('resize', () => {
      windowScope.isMobile = $(window).width() < 768;
      windowScope.pageObj = {
        isMobile: $(window).width() < 768,
        count: windowScope.counter++
      };
      // console.log('isMobile ', windowScope.pageObj);
    });
  }
}
