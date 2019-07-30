import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

export const commonValidateSin: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let sin = control.value;

  // pre req checks
  if (sin === null || sin === undefined || sin.length < 1) {
    return { 'required': true };
  }

  // Init weights and other stuff
  const weights: number[] = [1, 2, 1, 2, 1, 2, 1, 2, 1];
  let sum = 0;

  // Clean up string
  sin = sin.trim();

  // Rip off spaces a regex
  const regexp = new RegExp('[ ]', 'g');
  sin = sin.replace(regexp, '');

  // Test for length
  if (sin.length !== 9) {
    return { 'invalid': true };
  }

  // Test for string of zeros
  if ( sin === '000000000') {
    return { 'invalid': true };
  }

  // Walk through each character
  for (let i = 0; i < sin.length; i++) {

    // pull out char
    const char = sin.charAt(i);

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

  // All done!
  return null;
};

@Directive({
  selector: '[commonValidateSin]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateSinDirective, multi: true}
  ]
})
export class ValidateSinDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {
    return commonValidateSin( control );
  }
}
