import { Component, OnInit, Input } from '@angular/core';
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

  public expandText: string =  '(click to expand)';
  ngOnInit() {
  }

  constructor() { }


}
