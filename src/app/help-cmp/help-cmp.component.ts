import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-cmp',
  templateUrl: './help-cmp.component.html',
  styleUrls: ['./help-cmp.component.css']
})
export class HelpCmpComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

}
