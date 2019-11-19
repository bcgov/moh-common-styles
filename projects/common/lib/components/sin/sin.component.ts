import { Component, EventEmitter, Input, Output, Optional, Self, OnInit} from '@angular/core';
import { NUMBER, SPACE } from '../../models/mask.constants';
import { NgControl, ValidationErrors } from '@angular/forms';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { LabelReplacementTag, ErrorMessage } from '../../models/error-message.interface';

/**
 * This component reports the following errors.
 *    required
 *    invalid
 *    duplicate
 *
 *  These messages can be changed by updated messages using the errorMessages interface
 *  Ex. { required: 'This field is required', invalid: '{label} is invalid' }
 */

@Component({
  selector: 'common-sin',
  templateUrl: './sin.component.html',
  styleUrls: ['./sin.component.scss']
})
export class SinComponent extends AbstractFormControl implements OnInit {

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalid: `${LabelReplacementTag} is invalid.`,
    duplicate: `${LabelReplacementTag} was already used for another family member.`
  };

  sin: string = '';
  mask: any;

  @Input() label: string = 'Social Insurance Number (SIN)';
  @Input() maxlength: string = '15';
  @Input() placeholder: string = '111 111 111';
  @Input() labelforId: string = 'sin_' + this.objectId;

  @Input()
  set value( val: string ) {
    console.log( 'set value: ', val );
    if ( val ) {
      this.sin = val;
    }
  }
  get value() {
    return this.sin;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }

    this.mask =
    [NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  }

  ngOnInit() {
    super.ngOnInit();

    this.registerValidation( this.controlDir, this.validateSelf );
  }

  onValueChange( value: any ) {

    if ( value !== this.sin ) { // IE fix when focus does not display required error
      this.sin = value;
      this._onChange( value );
      this.valueChange.emit( value );
    }
  }

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.sin = value;
    }
  }

  private validateSelf(): ValidationErrors | null {

    const validateResult = this.validateSin();
    if ( validateResult ) {
      return validateResult;
    }
    return null;
   }

   private validateSin(): ValidationErrors | null {

    if ( this.sin && this.sin.trim().length > 0 ) {

      // Init weights and other stuff
      const weights: number[] = [1, 2, 1, 2, 1, 2, 1, 2, 1];
      let sum = 0;

      // Clean up string
      const value = this.sin.trim();
      this.sin = value
                  .replace(/_/g, '') // remove underlines
                  .replace(/\s/g, ''); // spaces

      // Test for length
      if (this.sin.length !== 9) {
        return { 'invalid': true };
      }

      // Test for string of zeros
      if ( this.sin === '000000000') {
        return { 'invalid': true };
      }

      // Walk through each character
      for (let i = 0; i < this.sin.length; i++) {

        // pull out char
        const char = this.sin.charAt(i);

        // parse the number
        const num = Number(char);
        if (Number.isNaN(num)) {
          return { 'invalid': true };
        }

        // multiply the value against the weight
        let result = num * weights[i];

        // If two digit result, substract 9
        if (result > 9) {
          result = result - 9;
        }

        // add it to our sum
        sum += result;
      }

      // The sum must be divisible by 10
      if (sum % 10 !== 0) {
        return { 'invalid': true };
      }

    }

    return null;
  }
}
