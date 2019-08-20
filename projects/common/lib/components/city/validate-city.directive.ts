import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

export const commonValidateCity: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  /**
   * Valid characters for  city names
   */
 const criteria: RegExp = RegExp( '^(?=.*[a-zA-Z])[a-zA-Z0-9\-.\' ]*$' );

 if ( control.value ) {
    const result = criteria.test( control.value );
    return result ? null : { 'invalidChar': true };
 }
 return null;
};

@Directive({
  selector: '[commonValidateCity]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateCityDirective, multi: true}
  ]
})
export class ValidateCityDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return commonValidateCity( control );
  }

}
