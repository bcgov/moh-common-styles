import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, forwardRef, Optional, Self } from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, NgForm, NgModel, ControlValueAccessor, NgControl } from '@angular/forms';
import * as moment_ from 'moment';
import { ErrorMessage, LabelReplacementTag, replaceLabelTag } from '../../models/error-message.interface';
const moment = moment_;

// TODO: ControlValueAccessor
// TODO: Remove moment


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
})
export class DateComponent extends Base implements OnInit, ControlValueAccessor {
  // Exists for unit testing to validate errors set
  @ViewChild( 'monthRef' ) monthRef: NgModel;
  @ViewChild( 'dayRef' ) dayRef: NgModel;
  @ViewChild( 'yearRef') yearRef: NgModel;

  @Input() date: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();


  @Input() disabled: boolean = false;
  @Input() label: string = 'Date';
  /** Can be one of: "future", "past". "future" includes today, "past" does not. */
  @Input() restrictDate: 'future' | 'past' | 'any' = 'any';
  @Input() errorMessages: ErrorMessage | DateErrorMsg;

  /** @deprecated */
  @Input() required: boolean = true;
  // @Input() useCurrentDate: boolean = false; // just pass in new Date()


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

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor(@Optional() @Self() public controlDir: NgControl,
              public form: NgForm,
              private cd: ChangeDetectorRef) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }



  ngOnInit() {

    this.setErrorMsg();
  }

  get month(): number {
    if (this.date){
      return this.date.getMonth()
    }
  }

  get day(): number {
    if (this.date){
      return this.date.getDate()
    }
  }

  get year(): number {
    if (this.date){
      return this.date.getFullYear()
    }
  }

  /** Set the month and notify caller of change */
  setMonth( value: string ): void {
    const month = this.getNumericValue( value );

    // console.log( 'monthRef: ', this.monthRef );
    if ( this.date ) {
      this.date.setMonth(month);
      // this.date.month = month;
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
      // this.date.day = day;
      this.date.setDate(day);

      this.triggerYearValidation();
      this.dateChange.emit( this.date );
    }
  }

  /** Set the year and notify caller of change */
  setYear( value: string ): void {
    const year = this.getNumericValue( value );

    if ( this.date ) {
      // this.date.year = year;
      this.date.setFullYear(year);
      this.triggerDayValidation();
      this.dateChange.emit( this.date );
    }
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
    Object.keys(this.defaultErrMsg).map( x => this.defaultErrMsg[x] = replaceLabelTag( this.defaultErrMsg[x] , this.label ) );
  }



  writeValue( value: Date ): void {
    if ( value ) {
      this.date = value;
    }
  }

  // Register change function
  registerOnChange( fn: any ): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched( fn: any ): void {
    this._onTouched = fn;
  }
}
