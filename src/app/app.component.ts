import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isMobile: boolean = $(window).width() < 768;
  pageObj: any;
  counter: number = 0;
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
