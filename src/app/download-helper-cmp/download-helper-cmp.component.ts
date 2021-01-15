import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download-helper-cmp',
  templateUrl: './download-helper-cmp.component.html',
  styleUrls: ['./download-helper-cmp.component.css']
})
export class DownloadHelperCmpComponent implements OnInit {

  visible = false;
  visibleAnimate = false;
  downloadUrl = '';

  constructor( ) { }

  ngOnInit() {
  }

  show(url: string) {
    this.downloadUrl = url;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  hide() {
    this.visible = false;
  }

}
