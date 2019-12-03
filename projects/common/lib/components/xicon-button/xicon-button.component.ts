import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoHCommonLibraryError } from '../../../helpers/library-error';

@Component({
  selector: 'common-xicon-button',
  templateUrl: './xicon-button.component.html',
  styleUrls: ['./xicon-button.component.scss']
})
export class XiconButtonComponent implements OnInit {

  /**
   * Label to use for accessibility.
   * @required
   */
  @Input() label: string;
  /**
   * @deprecated - Remove at breaking change and go to (click)
   */
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (!this.label) {
      // todo - change to MohCommmonLibraryError -> test in IE10
      // throw Error('common-xicon-button initialized without label. You MUST supply a label attribute for accessibility.');
      const msg = `common-xicon-button initialized without label. You MUST supply a label attribute for accessibility.
      e.g. <common-xicon-button label='Remove Spouse'>
`; // Intentional to create a blank line between our error and stack trace.
      throw new MoHCommonLibraryError(msg);
    }
  }

  onBtnClick() {
    this.clickEvent.emit();
    this.click.emit();
  }
}
