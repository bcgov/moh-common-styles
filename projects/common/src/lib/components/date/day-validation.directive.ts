import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[commonDayValidation]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => DayValidationDirective), multi: true}
  ]
})
export class DayValidationDirective implements Validator {

  validate( control: FormControl ): {[key: string]: any} | null {
    const date = control.parent.value;

    if ( !control.value ) {
      return null; // empty value
    }

    const day: number = parseInt( control.value, 10 );
    console.log( 'day: ', day );

    if ( !isNaN( day ) ) {

      console.log( 'parent: ', date );
      // Only process of value is numeric
      if ( !isNaN( date.month )  && !isNaN( date.year ) ) {

        // Determine days in month
        const str = `${date.year}-${date.month}`;
        let daysInMonth: number = moment(str, 'YYYY-MM').daysInMonth();
        console.log( 'str: ', str + ', dayInMonth: ', daysInMonth );

        if ( isNaN( daysInMonth ) ) {
          daysInMonth = 31;
        }

        // Validate days
        if ( day > daysInMonth || day < 1 ) {
          return { 'dayOutOfRange': true };
        }
      }

      return null;
    }

    return { 'invalidValue': true };
  }

}
