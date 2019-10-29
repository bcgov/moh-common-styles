import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  Optional,
  Self,
  OnInit
} from '@angular/core';
import { ControlContainer, NgForm, NgControl } from '@angular/forms';
import { MaskModel, NUMBER, SPACE } from '../../models/mask.model';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * PhoneNumberComponent is a used to show the Phone number.
 *
 *
 * @example
 *         <common-phone-number name='phoneNumber'
 *                              [(ngModel)]='dataService.facAdminPhoneNumber'
 *                              required></common-phone-number>
 * @export
 */


@Component({
  selector: 'common-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  /* @deprecate this ViewProvider as we're using ControlValueAccessor @Optional  */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})

export class PhoneNumberComponent extends MaskModel implements ControlValueAccessor, OnInit {

  static PhoneNumberRegEx = '^[2-9]{1}\\d{2}[\\-]?\\d{3}[\\-]?\\d{4}$';
  @Input() displayMask: boolean = true;
  @Input() required: boolean = false;
  @Input() label: string = 'Mobile';

  @Input() allowInternational: boolean = true;

  public phoneNumber: string = '';

  public _onChange = (_: any) => { };
  public _onTouched = () => { };


  constructor(@Optional() @Self() public controlDir: NgControl) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }

  }

  ngOnInit() {
    const internationalPrefix = '+1';
    this.placeholder = '(555) 555-5555';
    this.mask = ['(', /[2-9]/, NUMBER, NUMBER, ')', SPACE, NUMBER, NUMBER, NUMBER, '-', NUMBER, NUMBER, NUMBER, NUMBER];

    if (this.allowInternational) {
      this.placeholder = `${internationalPrefix} ${this.placeholder}`;
      const prefixArrayOfChar = internationalPrefix.split(''); // ['+', '1']
      this.mask = [...prefixArrayOfChar, SPACE, ...this.mask];
    }



    // Register self validation
    Promise.resolve().then(() => {

      if (this.controlDir) {

        const allValidators = [this.validateSelf.bind(this)];
        if (this.controlDir.control.validator) {
          allValidators.push(this.controlDir.control.validator);
        }
        this.controlDir.control.setValidators(allValidators);
        this.controlDir.control.updateValueAndValidity();
      }
    });

  }

  get phoneNumberString(): string {
    return this.phoneNumber ? this.phoneNumber : '';
  }


  setPhoneNumber(evt) {
    const value = evt.target.value;
    this.phoneNumber = value;
    this.valueChange.emit(this.phoneNumber);
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


  private validateSelf() {
    const value = this.phoneNumber;
    const phoneLength = this.allowInternational ? 11 : 10;

    if (value) {
      const stripped = value
        .replace(/_/g, '') // remove underlines
        .replace(/\s/g, '') // spaces
        .replace(/\+|-/g, '') // + or - symbol
        .replace('(', '')
        .replace(')', '');

      const valid = stripped.length === phoneLength;

      console.log('self validation', { valid, stripped, phoneLength });
      return valid ? null : { required: true };

    }
    return null;

  }

}
