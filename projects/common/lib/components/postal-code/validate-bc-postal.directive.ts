import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[commonValidateBcPostal]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateBcPostalDirective, multi: true}
  ]
})
export class ValidateBcPostalDirective implements Validator {

  private criteria: RegExp = RegExp('^[Vv]\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\\d$');

  validate( control: AbstractControl ): {[key: string]: any} | null {

    if ( control.value ) {
      return this.criteria.test( control.value ) ? null : { 'invalidBCPostal': true };
    }
    return null;
  }
}
