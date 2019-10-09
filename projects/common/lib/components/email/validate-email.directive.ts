import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


@Directive({
  selector: '[commonValidateEmail]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: ValidateEmailDirective, multi: true}
  ]
})
export class ValidateEmailDirective implements Validator {

  validate( control: AbstractControl ): {[key: string]: any} | null {

    return commonValidateEmail( control );
  }
}


export const commonValidateEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const criteria: RegExp = /^(\S+)@(\S+)\.(\S+)$/;

  if (control.value) {
    const result = criteria.test(control.value);
    return result ? null : { invalidEmail: true };
  }
  return { invalidEmail: true };
};
