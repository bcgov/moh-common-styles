import { forwardRef, Component, OnInit, ViewChild, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { ControlContainer, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Button Component is a button which can be used across the application to have same button style.
 *
 *
 * @example
 *       	<common-button label='Remove Spouse'
 *            [(styleClass)]="buttonClass"
 *            (btnClick)='removeSpouse()'>
 *        </common-button>
 * @export
 */
@Component({
  selector: 'common-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => ButtonComponent )}
  ]
})

export class ButtonComponent implements OnInit {

  // Can pass the Style class of a button e.g. For primary, btn btn-primary. Default, btn btn-default. Error, btn btn-danger
  //@Input() styleClass: string = 'default';
  @Input() buttonType: 'default' | 'primary' | 'secondary' = 'default'
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
