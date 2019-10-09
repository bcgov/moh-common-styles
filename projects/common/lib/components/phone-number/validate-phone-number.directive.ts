import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

// TODO: Potentially make this configurable in the directive/function if we ever
// have different phone lengths.
const MIN_PHONE_LENGTH = 11;

@Directive({
  selector: '[commonValidatePhone]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatePhoneDirective, multi: true }]
})
export class ValidatePhoneDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return commonValidatePhone(control);
  }

}

/**
 * Deteremines if a phone number is incomplete, typically from
 * PhoneNumberComponent's text-mask having a lot of underscore characters.
 */
export const commonValidatePhone: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  console.log('valdating', control.value);
  const value = control.value;

  if (value) {
    const stripped = value
      .replace(/_/g, '') // remove underlines
      .replace(/\s/g, '') // spaces
      .replace(/\+|-/g, '') // + or - symbol
      .replace('(', '')
      .replace(')', '');

    const valid = stripped.length === MIN_PHONE_LENGTH;

    console.log({valid, stripped});
    return valid ? null : { required: true };

  }
  return null;
};
