import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccordionComponent } from 'ngx-bootstrap';
/**
 * AccordionComponent is a
 *
 * @example
 *       	<common-accordion
 *          title="'Documents'"
 *          [isOpen]="false">
  *       </common-accordion>
 * @export
 */

@Component({
  selector: 'common-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionCommonComponent implements OnInit {

  @Input() title: string;
  @Input() isOpen: boolean = false;
  @ViewChild('accordian') public accordian: AccordionComponent;

  public expandText: string =  '(click to expand)';
  ngOnInit() {
  }

  constructor() { }


}
