import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

// IMPROVEMENT: Add a 'flex' @Input(), that adds display flex.  Importantly, it
// must set flex on the wrapper/row divs in the html.  There are some cases
// (like SiteReg) where having flex layout is beneficial.  My first suggestion
// was to simply style the <common-page-section>, but the problem is that we
// need flex on the child elements of page-section (that still wrap ng-content).

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
