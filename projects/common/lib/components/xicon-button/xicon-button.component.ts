import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'common-xicon-button',
  templateUrl: './xicon-button.component.html',
  styleUrls: ['./xicon-button.component.scss']
})
export class XiconButtonComponent {

  @Input() label: string;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  onBtnClick() {
    this.clickEvent.emit();
  }
}
