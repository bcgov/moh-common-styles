import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


// TODO: determine whether this is used or not.  If not use, maybe it can be removed
export const commonValidateBcPostal: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  /**
  * Valid characters for BC postal code
  */
 const criteria: RegExp = RegExp('^[Vv]\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\\d$');

  if ( control.value ) {
    return criteria.test( control.value ) ? null : { 'invalidBCPostal': true };
  }
  return null;
};

@Directive({
  selector: '[commonValidateBcPostal]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateBcPostalDirective, multi: true}
  ]
})
export class ValidateBcPostalDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {
    return commonValidateBcPostal( control );
  }
}
