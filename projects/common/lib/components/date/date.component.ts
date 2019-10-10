import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, forwardRef } from '@angular/core';
import { Base } from '../../models/base';
import { SimpleDate } from '../../models/simple-date.interface';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import * as moment_ from 'moment';
import { ErrorMessage, LabelReplacementTag, replaceLabelTag } from '../../models/error-message.interface';
const moment = moment_;

/**
 * Component NPM package dependencies:
 * a) moment
 *
 * This component reports the following errors.
 *    required
 *    dayOutOfRange
 *    yearDistantPast
 *    yearDistantFuture
 *    noFutureDatesAllowed
 *    invalidValue
 *
 *  These messages can be changed by updated messages using the errorMessages interface/
 *  Ex. { required: 'This field is required', invalidValue: '{label} is invalid' }
 */

export interface DateErrorMsg { // TODO: Remove - possible breaking change - currently datepicker uses it
  required?: string;
  dayOutOfRange?: string;
  yearDistantPast?: string;
  yearDistantFuture?: string;
  noPastDatesAllowed?: string;
  noFutureDatesAllowed?: string;
  invalidValue?: string;
}

@Component({
  selector: 'common-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class DateComponent extends Base implements OnInit {
  // Exists for unit testing to validate errors set
  @ViewChild( 'monthRef' ) monthRef: NgModel;
  @ViewChild( 'dayRef' ) dayRef: NgModel;
  @ViewChild( 'yearRef') yearRef: NgModel;

  @Input() useCurrentDate: boolean = false;
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Date';
  @Input() date: SimpleDate;
  /** Can be one of: "future", "past". "future" includes today, "past" does not. */
  @Input() restrictDate: 'future' | 'past' | 'any' = 'any';
  @Input() errorMessages: ErrorMessage | DateErrorMsg;

  @Output() dateChange: EventEmitter<SimpleDate> = new EventEmitter<SimpleDate>();

  public monthList: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  monthLabelforId: string = 'month_' + this.objectId;
  dayLabelforId: string = 'day_' + this.objectId;
  yearLabelforId: string = 'year_' + this.objectId;

  defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    dayOutOfRange: `Invalid ${LabelReplacementTag}.`,
    yearDistantPast: `Invalid ${LabelReplacementTag}.`,
    yearDistantFuture: `Invalid ${LabelReplacementTag}.`,
    noPastDatesAllowed: `Invalid ${LabelReplacementTag}.`,
    noFutureDatesAllowed: `Invalid ${LabelReplacementTag}.`,
    invalidValue: `Invalid ${LabelReplacementTag}.`
  };

  constructor( public form: NgForm,
               private cd: ChangeDetectorRef ) {
    super();
  }

  ngOnInit() {

    this.setErrorMsg();

    if ( this.useCurrentDate ) {
      // Set date to current date
      this.date.month = moment().month();
      this.date.day = moment().date();
      this.date.year = moment().year();
    }
  }

  /** Set the month and notify caller of change */
  setMonth( value: string ): void {
    const month = this.getNumericValue( value );

    // console.log( 'monthRef: ', this.monthRef );
    if ( this.date ) {
      this.date.month = month;
      this.triggerDayValidation();
      this.triggerYearValidation();
      this.dateChange.emit( this.date );
    }
  }

  /** Set the day and notify caller of change */
  setDay( value: string ): void {
    const day = this.getNumericValue( value );

    // console.log(  'dayRef: ', this.dayRef );
    if ( this.date ) {
      this.date.day = day;
      this.triggerYearValidation();
      this.dateChange.emit( this.date );
    }
  }

  /** Set the year and notify caller of change */
  setYear( value: string ): void {
    const year = this.getNumericValue( value );

    if ( this.date ) {
      this.date.year = year;
      this.triggerDayValidation();
      this.dateChange.emit( this.date );
    }
  }

  // Replace tag in message
  errorMessage( msg: string ) {
    return replaceLabelTag( msg, this.label );
  }

  /**
   * Force the `day` input to run it's directives again. Important in cases
   * where user fills fields out of order, e.g. sets days to 31 then month to
   * Februrary.
   */
  private triggerDayValidation() {
    // We have to wrap this in a timeout, otherwise it runs before Angular has updated the values
    setTimeout( () => {
      if ( this.form.controls[this.dayLabelforId] ) {
        this.form.controls[this.dayLabelforId].updateValueAndValidity();
        this.cd.detectChanges();
      }
    }, 0);
  }

  private triggerYearValidation() {
    // We have to wrap this in a timeout, otherwise it runs before Angular has updated the values
    setTimeout( () => {
      if ( this.form.controls[this.yearLabelforId] ) {
        this.form.controls[this.yearLabelforId].updateValueAndValidity();
        this.cd.detectChanges();
      }
    }, 0);
  }

  /** Convert string to numeric value or null if not */
  private getNumericValue( value: string ): number | null {
    const parsed = parseInt( value, 10 );
    return ( isNaN( parsed ) ? null : parsed );
  }

  private setErrorMsg() {
    if ( this.errorMessages ) {
      Object.keys(this.errorMessages).map( x => this.defaultErrMsg[x] = this.errorMessages[x] );
    }
  }
}
