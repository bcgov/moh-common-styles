import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, forwardRef, Optional, Self, Injector } from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, NgForm, NgModel, ControlValueAccessor, NgControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment_ from 'moment';
import { ErrorMessage, LabelReplacementTag, replaceLabelTag } from '../../models/error-message.interface';
const moment = moment_;

// TODO: ControlValueAccessor
// TODO: Remove moment
// TODO: Remove SimpleDate
// TODO: Write the "Private" validators for things like missing required fields
// TODO: Add "public" / exportable validators that work directly on Date object for e.g. dateOutOfRange

export const commonValidateDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  // Hardcoded for now just to see if it works.
  // return {noFutureDatesAllowed: true};
  return null;
};


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
  
  // @Input() dateRangeStart
  // @Input() dateRangeEnd
  // errMsg: dateBeforeStart, dateAfterEnd
  // combine: dayOutOfRange with yearDistantPast, yearDistantFuture
  // leave noPastDatesAllowed / noFutureDatesAllowed and @Input() restrictDates alone.

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
              private injector: Injector,
              public form: NgForm,
              private cd: ChangeDetectorRef) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }




  ngOnInit() {
    this.setErrorMsg();


    Promise.resolve().then(() => {
      const hostControl = this.injector.get(NgControl, null);
      console.log({hostControl});
      if (hostControl) {
        // hostControl.control.setValidators(this.control.validator);
        // hostControl.control.setValidators(commonValidateDate);
        // TODO: Adam Document
        hostControl.control.setValidators(this.validateDate.bind(this));
        hostControl.control.updateValueAndValidity();
      }
    });


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
    // console.log('set-day', {day, value});
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
    // console.log('set-year', {year, value});
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

  // TODO - May need to refactor this to get error logic working
  // Only want to show errors (and thus call _onChange() after all inputs touched)
  private destroyDate() {
    if (this.date) {
      this.date = null;
      this._onChange(null);
      this.dateChange.emit(null);
    }
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


  private validateDate() {
    const year = parseInt(this._year, 10);
    const month = parseInt(this._month, 10);
    const day = parseInt(this._day, 10);
    console.log('validateDate', {year, month, day});

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      // return { invalidValue: true };
      return { invalidValue: true };
    }

    // if (this.dateFieldIsEmpty(this._year)
    //   || this.dateFieldIsEmpty(this._month)
    //   || this.dateFieldIsEmpty(this._day)) {
    //   return errObj;
    // }

    // TODO: Check that day exists in month (e.g. leap years, feb, etc)
    if ( day > 35 || day < 1) {
      return {dayOutOfRange: true};
    }

    // TODO: year distant future
    // TODO: year distant past

    return null;
  }

  // private dateFieldIsEmpty(field: string | null | undefined): boolean {
  //   return typeof field === 'string' && field.length >= 1;
  // }


}
