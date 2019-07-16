import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MaskModel, NUMBER, SPACE } from '../../models/mask.model';

import {  ControlValueAccessor,  NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * PhoneNumberComponent is a used to show the Phone number.
 *
 * @example
 *       	<common-phone-number label='Mobile/SMS' [phoneNumber] = "person.phoneNumber"
 *          (onChange)= "handlePhoneNumberChange($event)" [displayMask]="true">
*         </common-phone-number>

 * @export
 */


@Component({
  selector: 'common-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PhoneNumberComponent )}
  ]
})

export class PhoneNumberComponent extends MaskModel implements ControlValueAccessor {
  
  static PhoneNumberRegEx = '^[2-9]{1}\\d{2}[\\-]?\\d{3}[\\-]?\\d{4}$';
  @Input() displayMask: boolean = true;
  @Input() required: boolean = false;
  @Input() label: string = 'Mobile';
  @Input() phoneNumber: string;

  /** @deprecate - Do we have any applications that need to use this? */
  @Input() objectID: string = 'phone_' + this.objectId;
  @Output() onChange = new EventEmitter<string>();
  // public mask = ['+','1',SPACE,'(',NUMBER,NUMBER,NUMBER,')',SPACE,NUMBER,NUMBER,NUMBER,'-',NUMBER,NUMBER,NUMBER,NUMBER];
  public _onChange = (_: any) => {};
  public _onTouched = () => {};
  
  
  constructor() {
    super();
    this.placeholder = '+1 (555) 555-5555';
    this.mask = ['+', '1', SPACE, '(', NUMBER, NUMBER, NUMBER, ')', SPACE, NUMBER, NUMBER, NUMBER, '-', NUMBER, NUMBER, NUMBER, NUMBER];
  }


  setPhoneNumber(value: string) {
    this.phoneNumber = value;
    this.onChange.emit(this.phoneNumber);
    this._onChange(value);
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
