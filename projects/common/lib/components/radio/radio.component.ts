import {forwardRef, ElementRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Base} from '../../../models/src/base';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * RadioComponent is a single radio which can be used to have multiple radios based on 
 * the radio label values.
 * 
 * @example
 *       	<common-radio #gender [value]="person.gender" 
 *          label='Gender' 
 *          [radioLabels]='[{"label": "Male", "value": "Male"},{ "label": "Female", "value": "Female"}]' 
 *          (onStatusChange)="onChange.emit($event)"
 *          [showError]="showError">
 *        </common-radio>
 * 
 * /* You can have many radio's and the number is based on the Radio Label Value.
 *  For 3 radio buttons, radioLabels value should be passed in the below format 
 = [  
   {
     "label": "Myself only",
     "value": "MyselfOnly"
   },
   {
     "label": "All members on my MSP account",
     "value": "AllMembers"
   },
   {
     "label": "One specific member on my MSP account",
     "value": "SpecificMember"
   }];
 * @export
 */
@Component({
  selector: 'common-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => RadioComponent )}
  ]
})
export class RadioComponent extends Base implements ControlValueAccessor {


  @Input() radioLabels: Array<{label: string, value: string}> ; 
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Status';
  @Input() value: string ;
  @Input() showError: boolean;
  @Input() errorMessageRequired: string = this.label +' is required.';

  @Output() onStatusChange: EventEmitter<string> = new EventEmitter<string>();

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor() { super(); }

  setStatus(evt: string) {
    this.value = evt;
    this.onStatusChange.emit(evt);
    this._onChange(evt);
    this._onTouched();
   
  }
 
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

}
