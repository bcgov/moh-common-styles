import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  Optional,
  Self
} from '@angular/core';
import { ControlContainer, NgForm, NgControl } from '@angular/forms';
import { MaskModel, NUMBER, SPACE } from '../../models/mask.model';

import {  ControlValueAccessor,  NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * PhoneNumberComponent is a used to show the Phone number.
 *
 * Make sure to add the direcive `commonValidatePhone`
 *
 * @example
 *         <common-phone-number name='phoneNumber'
 *                              [(ngModel)]='dataService.facAdminPhoneNumber'
 *                              commonValidatePhone
 *                              required></common-phone-number>
 * @export
 */


@Component({
  selector: 'common-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  /* @deprecate this ViewProvider as we're using ControlValueAccessor @Optional  */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ]
})

export class PhoneNumberComponent extends MaskModel implements ControlValueAccessor {

  static PhoneNumberRegEx = '^[2-9]{1}\\d{2}[\\-]?\\d{3}[\\-]?\\d{4}$';
  @Input() displayMask: boolean = true;
  @Input() required: boolean = false;
  @Input() label: string = 'Mobile';

  /** @deprecated - use ngModel - rename this to `value`. */
  @Input() phoneNumber: string = '';

  /** @deprecate - Do we have any applications that need to use this? */
  @Input() objectID: string = 'phone_' + this.objectId;
  @Output() onChange = new EventEmitter<string>();
  // public mask = ['+','1',SPACE,'(',NUMBER,NUMBER,NUMBER,')',SPACE,NUMBER,NUMBER,NUMBER,'-',NUMBER,NUMBER,NUMBER,NUMBER];
  public _onChange = (_: any) => {};
  public _onTouched = () => {};


  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }


    this.placeholder = '+1 (555) 555-5555';
    // Note - we added in the /[2-9]/ regex in order to match MSP's JSON Schema.
    // Make sure both places match.
    this.mask = ['+', '1', SPACE, '(', /[2-9]/, NUMBER, NUMBER, ')', SPACE, NUMBER, NUMBER, NUMBER, '-', NUMBER, NUMBER, NUMBER, NUMBER];
  }

  get phoneNumberString(): string {
    return this.phoneNumber ? this.phoneNumber : '';
  }


  setPhoneNumber(evt) {
    console.log('setphonenumber', evt.target.value);
    const value = evt.target.value;
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
    // phoneNumber is where the actual data is displayed to user for this
    // component
    this.phoneNumber = value;
  }

}
