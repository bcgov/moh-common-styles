import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

export const commonValidateStreet: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  /**
  * Valid characters for street
  */
 const criteria: RegExp = RegExp( '^(?=.*[a-zA-Z0-9])[a-zA-Z0-9#/&\-.\' ]*$' );

 if ( control.value ) {
    const result = criteria.test( control.value );
    return result ? null : { 'invalidChar': true };
 }
 return null;
};

@Directive({
  selector: '[commonValidateStreet]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateStreetDirective, multi: true}
  ]
})
export class ValidateStreetDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return commonValidateStreet( control );
  }

}
