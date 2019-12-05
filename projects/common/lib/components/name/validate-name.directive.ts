import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * @deprecated
 * @param control
 */
export const commonValidateName: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
   /**
   * Valid characters for name
   */
  const criteria: RegExp = RegExp( '^[a-zA-Z][a-zA-Z\-.\' ]*$' );

  if ( control.value ) {
    return criteria.test( control.value ) ? null : { 'invalidChar': true };
  }
  return null;
};


/**
 * @deprecated
 */
@Directive({
  selector: '[commonValidateName]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateNameDirective, multi: true}
  ]
})
export class ValidateNameDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return commonValidateName( control );
  }
}
