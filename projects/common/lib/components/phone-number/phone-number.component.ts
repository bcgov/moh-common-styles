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
import { NUMBER, SPACE } from '../../models/mask.constants';

import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
import { AbstractFormControl } from '../../models/abstract-form-control';
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
})

export class PhoneNumberComponent extends AbstractFormControl implements OnInit {

  static PhoneNumberRegEx = '^[2-9]{1}\\d{2}[\\-]?\\d{3}[\\-]?\\d{4}$';
  @Input() displayMask: boolean = true;
  @Input() required: boolean = false;
  @Input() label: string = 'Mobile';

  @Input() allowInternational: boolean = true;

  // Setter/getter for when not used in form (ex. data dislayed but not edittable)
  @Input()
  set value( val: string ) {
    if ( val !== undefined ) {
      this.phoneNumber = val;
    }
  }
  get value() {
    return this.phoneNumber;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  public phoneNumber: string = '';

  public mask: any;
  public placeholder: string;

  // Abstact variable defined
  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    incompleteValue: `${LabelReplacementTag} does not appear to be valid.`
  };

  constructor(@Optional() @Self() public controlDir: NgControl) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();

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

  setPhoneNumber(value) {
    console.log( 'setPhoneNumber: ', value );
    // const value = evt.target.value;
    this.phoneNumber = value;
    this.valueChange.emit(this.phoneNumber);
    this._onChange(value);
  }

  onBlur( $event ) {
    this._onTouched($event);
  }


  writeValue(value: any): void {
    if  (value !== undefined ) {
      // phoneNumber is where the actual data is displayed to user for this
      // component
      this.phoneNumber = value;
    }
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
      return valid ? null : { incompleteValue: true };

    }
    return null;

  }

}
