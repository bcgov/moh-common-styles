import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, forwardRef, Optional, Self } from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, NgForm, NgModel, ControlValueAccessor, NgControl } from '@angular/forms';
import * as moment_ from 'moment';
import { ErrorMessage, LabelReplacementTag, replaceLabelTag } from '../../models/error-message.interface';
const moment = moment_;

// TODO: ControlValueAccessor
// TODO: Remove moment
// TODO:


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
  @Input() errorMessages: ErrorMessage;

  /** @deprecated */
  @Input() required: boolean = true;
  // @Input() useCurrentDate: boolean = false; // just pass in new Date()

  // The actual values displayed to the user.  May not precisely match Date
  // object, because these fields can be blank whereas a Date can never have a
  // "blank" year for example. All are nullable stings of numbers "0" or "2".
  _year: string;
  _month: string;
  _day: string;

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

  // TODO: call setDisplayVariables on ngOnChanges if Input changes?

  get month(): number {
    if (this.date) {
      return this.date.getMonth();
    }
  }

  setMonth(value: string): void {
    const month = this.getNumericValue( value );
    console.log('set-month', {month, value});
    this._month = value;
    if (this.date) {
      this.dateChange.emit( this.date );
      this.date.setMonth(month);
    }
    this.processDate();
  }

  get day(): number {
    if (this.date) {
      return this.date.getDate();
    }
  }

  setDay(value: string) {
    const day = this.getNumericValue( value );
    console.log('set-day', {day, value});
    this._day = value;
    if (this.date) {
      this.dateChange.emit( this.date );
      this.date.setDate(day);
    }
    this.processDate();
  }

  get year(): number {
    if (this.date) {
      return this.date.getFullYear();
    }
  }

  setYear(value: string) {
    const year = this.getNumericValue( value );
    console.log('set-year', {year, value});
    this._year = value;
    if (this.date) {
      this.dateChange.emit( this.date );
      this.date.setFullYear(year);
    }
    this.processDate();
  }

  private processDate() {
    if (this.canCreateDate()) {
      const year = this.getNumericValue(this._year);
      const month = this.getNumericValue(this._month);
      const day = this.getNumericValue(this._day);
      console.log('CREATING DATE', {year, month, day});

      this.date = new Date(year, month, day);
      this._onChange(this.date);
      this.dateChange.emit(this.date);
    } else {
      this.destroyDate();
    }
  }

  private destroyDate() {
    this.date = null;
    this._onChange(null);
    this.dateChange.emit(null);
  }

  // Only create Date if all fields are filled.
  // Note: fields/date may still be invalid (e.g. 99 for day field)
  private canCreateDate(): boolean {

    // special because "0" is valid (Jan)
    const monthCheck = typeof this._month === 'string'
      || typeof this._month === 'number';

    if (!!this._year && !!this._day && monthCheck) {
      return true;
    }
  }

  /** Set the month and notify caller of change */
  // setMonth( value: string ): void {
  //   const month = this.getNumericValue( value );

  //   if ( this.date ) {
  //     console.log('seMonth', month);

  //     this.date.setMonth(month);
  //     // TODO: TEST / VERIFY CAN REMOVE
  //     // this.triggerDayValidation();
  //     // this.triggerYearValidation();
  //     this.dateChange.emit( this.date );
  //   }
  // }

  // /** Set the day and notify caller of change */
  // setDay( value: string ): void {
  //   const day = this.getNumericValue( value );

  //   if ( this.date ) {
  //     console.log('seDay', day);
  //     this.date.setDate(day);
  //     // TODO: TEST / VERIFY CAN REMOVE
  //     // this.triggerYearValidation();
  //     this.dateChange.emit( this.date );
  //   }
  // }

  // /** Set the year and notify caller of change */
  // setYear( value: string ): void {
  //   const year = this.getNumericValue( value );

  //   if ( this.date ) {
  //     console.log('setYear', year);
  //     this.date.setFullYear(year);
  //     // TODO: TEST / VERIFY CAN REMOVE
  //     // this.triggerDayValidation();
  //     this.dateChange.emit( this.date );
  //   }
  // }

  // /**
  //  * Force the `day` input to run it's directives again. Important in cases
  //  * where user fills fields out of order, e.g. sets days to 31 then month to
  //  * Februrary.
  //  */
  // private triggerDayValidation() {
  //   // We have to wrap this in a timeout, otherwise it runs before Angular has updated the values
  //   setTimeout( () => {
  //     if ( this.form.controls[this.dayLabelforId] ) {
  //       this.form.controls[this.dayLabelforId].updateValueAndValidity();
  //       this.cd.detectChanges();
  //     }
  //   }, 0);
  // }

  // private triggerYearValidation() {
  //   // We have to wrap this in a timeout, otherwise it runs before Angular has updated the values
  //   setTimeout( () => {
  //     if ( this.form.controls[this.yearLabelforId] ) {
  //       this.form.controls[this.yearLabelforId].updateValueAndValidity();
  //       this.cd.detectChanges();
  //     }
  //   }, 0);
  // }

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

  private setDisplayVariables() {
    this._day = this.date.getDate().toString();
    this._month = this.date.getMonth().toString();
    this._year = this.date.getFullYear().toString();
  }



  writeValue( value: Date ): void {
    if ( value ) {
      this.date = value;
      this.setDisplayVariables();
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
