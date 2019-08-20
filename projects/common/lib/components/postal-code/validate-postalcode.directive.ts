import { Directive, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';
import { calendarFormat } from 'moment';

// local function
function validatePC(control: AbstractControl, hasMask: boolean): { [key: string]: boolean } | null {

  console.log( 'Control value = ', control.value );
  if ( control.value ) {
    if ( hasMask ) {
      console.log( 'hasMask' );
      const cdnFormat: RegExp = /^[A-Za-z][0-9][A-Za-z]\s?[0-9][A-Za-z][0-9]$/;
      return cdnFormat.test( control.value ) ? null : { 'pattern': true };
    }

    console.log( 'no mask' );
    const criteria: RegExp = RegExp( '^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 ]*$' );
    return criteria.test( control.value ) ? null : { 'invalidChar': true };
  }
  return null;
}

export function commonValidatePostalcode( hasMask: boolean ): ValidatorFn {

  return ( control: AbstractControl ): { [key: string]: boolean } | null => {
    return validatePC( control, hasMask );
  };
}

@Directive({
  selector: '[commonValidatePostalcode]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidatePostalcodeDirective, multi: true}
  ]
})
export class ValidatePostalcodeDirective implements Validator {
  @Input() hasMask: boolean = true;

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return validatePC( control, this.hasMask );
  }

}
