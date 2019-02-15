import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import * as moment from 'moment';

// TODO:  Create a message structure to pass in error messages similar to password module.

@Directive({
  selector: '[commonYearValidate]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => YearValidateDirective), multi: true}
  ]
})
export class YearValidateDirective implements Validator  {

  @Input() commonYearValidate: string;

  validate( control: FormControl ): {[key: string]: any} | null {
    const date = control.parent.value;

    console.log( 'validate year: ', control.value );

    if ( !control.value ) {
      return null; // empty value
    }

    const year: number = parseInt( control.value, 10 );

    // Only process if value is numeric
    if ( !isNaN(  year ) ) {
      const currentYear = moment().get( 'y' );

      if ( currentYear - year > 150 ) {
        return { 'yearDistantPast': true };
      }

      if ( year - currentYear > 150 ) {
        return { 'yearDistantFuture': true} ;
      }

      // Check whether dates can be present or past
      if ( this.commonYearValidate && this.commonYearValidate !== 'any' &&
           !isNaN( date.day )  && !isNaN( date.month ) ) {

        const diff = moment( { year: year, month: date.month, day: date.day } )
          .diff( moment(), 'days', true );

         /**
          * Validate current date as if it's a future date, and reject it when only
          * accepting past dates.  We accomplish this by comparing diff against 1.
          */
          if ( diff < -1 && this.commonYearValidate === 'future' ) {
            return { 'noPastDatesAllowed': true };
          }

          if ( diff >= -1 && this.commonYearValidate === 'past' ) {
            return { 'noFutureDatesAllowed': true };
          }
      }

      return null;
    }

    return { 'invalidValue': true };
  }

}
