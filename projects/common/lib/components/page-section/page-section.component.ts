import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'common-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageSectionComponent implements OnInit {

  @Input() layout: 'double' | 'tips' | 'noTips' = 'tips';

  constructor() { }

  ngOnInit() {
  }

}
