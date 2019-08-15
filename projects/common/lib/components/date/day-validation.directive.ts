import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;

@Directive({
  selector: '[commonDayValidation][ngModel]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => DayValidationDirective), multi: true}
  ]
})
export class DayValidationDirective implements Validator {

  @Input() selectedMonth: string;
  @Input() selectedYear: string;

  validate( control: FormControl ): {[key: string]: any} | null {
    const year: number = parseInt( this.selectedYear, 10 );
    const month: number = parseInt( this.selectedMonth, 10 );

    if ( control.value !== null && control.value < 1) {
      return { 'invalidValue': true };
    }

    if ( !control.value ) {
      return null; // empty value
    }

    const day: number = parseInt( control.value, 10 );

    if ( !isNaN( day ) ) {

      // console.log( 'parent: ', date );
      // Only process of value is numeric
      if ( !isNaN( month )  && !isNaN( year ) ) {

        // Determine days in month
        const str = `${year}-${month}`;
        let daysInMonth: number = moment(str, 'YYYY-MM').daysInMonth();

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
