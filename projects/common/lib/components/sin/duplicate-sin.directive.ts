import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[commonDuplicateSin]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: DuplicateSinDirective, multi: true}
  ]
})
export class DuplicateSinDirective implements Validator {

  @Input() commonDuplicateSin: string[] = [];

  validate( control: AbstractControl ): {[key: string]: any} | null {

    console.log( 'commonDuplicateSin: ', this.commonDuplicateSin );

    if ( control.value ) {
      if ( this.commonDuplicateSin && this.commonDuplicateSin.length ) {

        const duplicate = this.commonDuplicateSin.find( x => x === control.value );
        console.log( 'duplicate sin: ', duplicate );
        return duplicate ? { 'duplicate': true } : null;
      }
    }
    return null;
  }
}
