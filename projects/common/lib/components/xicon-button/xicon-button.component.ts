import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'common-xicon-button',
  templateUrl: './xicon-button.component.html',
  styleUrls: ['./xicon-button.component.scss']
})
export class XiconButtonComponent {

  @Input() label: string;
  /**
   * @deprecated - Remove at breaking change and go to (click)
   */
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  onBtnClick() {
    this.clickEvent.emit();
    this.click.emit();
  }
}
