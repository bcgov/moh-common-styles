import { forwardRef, Component, OnInit, ViewChild, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

/**
 * Button Component is a button which can be used across the application to have
 * same button style.
 *
 * You're free to create custom (bootstrap) buttons as your application
 * requires. The main advantages to this component are:
 *
 *  - consistency
 *  - simplicity (less markup)
 *  - making future changes easier, such as automatically updating any changes
 * to button colour stylings.
 *
 *
 * @example
 *        <common-button label='Remove Spouse'
 *            [buttonType]="buttonClass"
 *            (btnClick)='removeSpouse()'>
 *        </common-button>
 * @export
 */
@Component({
  selector: 'common-button',
  templateUrl: './button.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ]
})

export class ButtonComponent implements OnInit {

  // Can pass the Style class of a button e.g. For primary, btn btn-primary. Default, btn btn-default. Error, btn btn-danger
  @Input() buttonType: 'default' | 'primary' | 'secondary' = 'default';
  @Input() disabled: boolean = false;
  @Input() label: string = 'Button';
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('button') button: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onClick($event) {
    this.btnClick.emit($event);
  }
}
