import { Directive, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';


// Local function
function checkForDuplicates( control: AbstractControl,
                             sinList: string[] ): { [key: string]: boolean } | null {
  // Duplicate Sin check
  if ( sinList && sinList.length ) {

    const duplicate = sinList.find( x => x === control.value );
    return (duplicate ? { 'duplicate': true } : null);
  }
  return null;
}

// TODO: Need to confirm this works with reactive forms
export function commonDuplicateSin( sinList: string[] ): ValidatorFn {

   console.log( 'function commonDuplicateSin: param = ', sinList );

  return ( control: AbstractControl ): { [key: string]: boolean } | null => {
    console.log( 'Control value = ', control.value );
    return checkForDuplicates( control, sinList );
  };
}


@Directive({
  selector: '[commonDuplicateSin]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: DuplicateSinDirective, multi: true}
  ]
})
export class DuplicateSinDirective implements Validator {

  @Input() sinList: string[];

  validate( control: AbstractControl ): {[key: string]: any} | null {
    return checkForDuplicates( control, this.sinList );
  }
}
