import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

export const commonValidateRegion: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  /**
   * Valid characters for country/province/region names
   */
 const criteria: RegExp = RegExp( '^(?=.*[a-zA-Z])[a-zA-Z\-.\' ]*$' );

 if ( control.value ) {
    const result = criteria.test( control.value );
    return result ? null : { 'invalidChar': true };
 }
 return null;
};

@Directive({
  selector: '[commonValidateRegion]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateRegionDirective, multi: true}
  ]
})
export class ValidateRegionDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return commonValidateRegion( control );
  }

}
