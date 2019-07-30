import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';


// Empty value (null, undefined, empty string) are treated as invalid.
 function validatePHN ( phn: string,
                        isBCPhn: boolean = true,
                        allowEmptyValue: boolean = false ): { [key: string]: boolean } | null {
  // pre req checks
  if (phn === null || phn === undefined || phn.trim().length < 1) {
    return ( allowEmptyValue ? null : { 'required': true } );
  }

  // Init weights and other stuff
  const weights: number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
  let sumOfRemainders = 0;

  // Clean up string
  phn = phn.trim();

  // Rip off leading zeros with a regex
  let regexp = new RegExp('^0+');
  phn = phn.replace(regexp, '');

  // remove spaces
  regexp = new RegExp('[ ]', 'g');
  phn = phn.replace(regexp, '');

  // Test for length
  if (phn.length !== 10) {
    return { 'invalid': true };
  }
  // Look for a number that starts with 9 if BC only
  if (isBCPhn && phn[0] !== '9') {
    return { 'invalid': true };
  } else if (!isBCPhn && phn[0] === '9') { // Number cannot have 9
    return { 'invalid': true };
  }

  // Walk through each character
  for (let i = 0; i < phn.length; i++) {

    // pull out char
    const char = phn.charAt(i);

    // parse the number
    const num = Number(char);
    if (Number.isNaN(num)) {
      return { 'invalid': true };
    }

    // Only use the multiplier if weight is greater than zero
    let result = 0;
    if (weights[i] > 0) {
    // multiply the value against the weight
    result = num * weights[i];

    // divide by 11 and save the remainder
    result = result % 11;

    // add it to our sum
    sumOfRemainders += result;
    }
  }

  // mod by 11
  const checkDigit = 11 - (sumOfRemainders % 11);

  // if the result is 10 or 11, it is an invalid PHN
  if (checkDigit === 10 || checkDigit === 11) {
    return { 'invalid': true };
  }

  // Compare against 10th digit
  const finalDigit = Number(phn.substring(9, 10));
  if (checkDigit !== finalDigit) {
   return { 'invalid': true };
  }

  // All done!
  return null;
}

// TODO: Need to confirm this works with reactive forms
export function commonValidatePhn( isBCPhn: boolean = true,
                                   allowEmptyValue: boolean = false): ValidatorFn {

  console.log( 'function commonValidatePhn: param = ', isBCPhn );

  return ( control: AbstractControl ): { [key: string]: boolean } | null => {
    console.log( 'Control value = ', control.value );
    return validatePHN( control.value, isBCPhn, allowEmptyValue );
  };
}

@Directive({
  selector: '[commonValidatePhn]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidatePhnDirective, multi: true}
  ]
})
export class ValidatePhnDirective implements Validator {

  @Input() isBCPhn: boolean = true;
  @Input() allowEmptyValue: boolean = false;

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return validatePHN( control.value, this.isBCPhn, this.allowEmptyValue );
  }
}
