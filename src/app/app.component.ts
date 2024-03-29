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
    private router: Router
  ) { }

  goClearHome() {
    window.location.href = window.location.href
      .split('/search')[0]
      .split('/details')[0]
      .split('/feedback')[0]
      .split('/imagery')[0]
      .split('/about')[0]
      .split('/help')[0]
      .split('/download')[0]
      .split('/resources')[0];
  }
  ngOnInit() {
    const windowScope = this;
    console.log('initiating');
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
