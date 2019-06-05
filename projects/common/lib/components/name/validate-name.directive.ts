import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[commonValidateName]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateNameDirective, multi: true}
  ]
})
export class ValidateNameDirective implements Validator {

  /**
   * Valid characters for name
   */
  private criteria: RegExp = RegExp( '^[a-zA-Z][a-zA-Z\-.\' ]*$' );

  validate( control: AbstractControl ): {[key: string]: any} | null {

    if ( control.value ) {
      return this.criteria.test( control.value ) ? null : { 'invalidChar': true };
    }
    return null;
  }
}
