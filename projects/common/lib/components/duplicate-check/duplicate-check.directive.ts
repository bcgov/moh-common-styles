import { Directive, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

// Local function
function checkForDuplicates( control: AbstractControl,
                             dupList: string[] ): { [key: string]: boolean } | null {
  // Duplicate check
  if ( dupList && dupList.length ) {

  const duplicate = dupList.find( x => x === control.value );
  return (duplicate ? { 'duplicate': true } : null);
  }
  return null;
}

// TODO: Need to confirm this works with reactive forms
export function commonDuplicateCheck( dupList: string[] ): ValidatorFn {

  return ( control: AbstractControl ): { [key: string]: boolean } | null => {
    return checkForDuplicates( control, dupList );
  };
}

@Directive({
  selector: '[commonDuplicateCheck]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: DuplicateCheckDirective, multi: true}
    ]
})
export class DuplicateCheckDirective implements Validator {

  @Input() dupList: string[];

  validate( control: AbstractControl ): {[key: string]: any} | null {
  return checkForDuplicates( control, this.dupList );
  }
}
