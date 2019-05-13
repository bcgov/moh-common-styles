import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * ButtonGroupComponent is a radio components which shows YES/NO option as a button group
 *
 *
 *
 * @example
 *       <common-button-group [showError]="showError"
 *          [errorMessageRequired]="requiredErrMsg"
 *          label="Please select a value"
 *          [data]="data.value" (dataChange)="setMovedToBCPermanently($event)" >
 *         </common-button-group>
 *
 * @export
 */


@Component({
  selector: 'common-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => ButtonGroupComponent )}
  ]
})
export class ButtonGroupComponent implements ControlValueAccessor {

  @Input() data: boolean;
  @Input() required: boolean = true;
  @Input() showError: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessageRequired: string = 'Field is required.';
  @Input() label: string = 'Default Checkbox';
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('buttonGroup') buttonGroup: ElementRef;

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor() {

  }


  setButtonGrpVal(val: any) {
    this.dataChange.emit(val);
    this._onChange(val);
    this._onTouched();
  }

  focus() {
    this.buttonGroup.nativeElement.focus();
    this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.data = value;
  }
}
