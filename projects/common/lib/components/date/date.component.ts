import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional, Self, SimpleChanges, OnChanges, Inject
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  NG_VALIDATORS} from '@angular/forms';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addYears from 'date-fns/addYears';
import subYears from 'date-fns/subYears';
import { MoHCommonLibraryError } from '../../../helpers/library-error';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { compareAsc, startOfDay, addDays } from 'date-fns';

/**
 * DateComponent
 * You cannot use "[restrictDate]" in combination with either  "[dateRangeEnd]" or "[dateRangeStart]".
 * You must use either [restrictDate] or the [dateRange*] inputs.
 *
 * @example
 *  To trigger 'no future dates allowed' using date ranges set the range end date to yesterday's date.
 *    <common-date name='effectiveDate'
 *       label="Effective Date"
 *       [dateRangeEnd]='yesterday'
 *       formControlName="effectiveDate"></common-date>
 *'
  *  To trigger 'no past dates allowed' using date ranges set the range start date to today's date.
 *    <common-date name='effectiveDate'
 *       label="Effective Date"
 *       [dateRangeStart]="today"
 *       formControlName="effectiveDate"></common-date>
 *
 *  To allow instructions under label.
 *    <common-date name='effectiveDate'
 *       label="Effective Date"
 *       [dateRangeEnd]='yesterday'
 *       formControlName="effectiveDate">
 *      <p>This is a test.</p>
 *    </common-date>
 * @export
 *
 */


const MAX_YEAR_RANGE = 150;
const distantFuture = addYears(startOfToday(), MAX_YEAR_RANGE);
const distantPast = subYears(startOfToday(), MAX_YEAR_RANGE);


@Component({
  selector: 'common-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent extends AbstractFormControl
  implements OnInit, ControlValueAccessor, OnChanges {

  // Inputs for disabled & errorMessage are found in the AbstractFormControl class
  @Input() date: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Input() label: string = 'Date';
  /** Can be one of: "future", "past". "future" includes today, "past" does not. */
  @Input() restrictDate: 'future' | 'past' | 'any' = 'any';

  // The actual values displayed to the user.  May not precisely match Date
  // object, because these fields can be blank whereas a Date can never have a
  // "blank" year for example. All are nullable stings of numbers "0" or "2".
  _year: string;
  _month: string = 'null'; // this makes it so the blank option is selected in the input
  _day: string;


  // variables for date ranges
  _dateRangeStart: Date = null;
  _dateRangeEnd: Date = null;

  /**
   * The earliest valid date that can be used.
   * Do NOT combine with restrictDates, as they set the same underlying values.
   */
  @Input()
  set dateRangeStart(dt: Date) {
    // Set time on date to 00:00:00 for comparing later
    this._dateRangeStart = dt ? startOfDay(dt) : null;
    // console.log( 'set dateRangeStart: ', dt, this._dateRangeStart );
  }
  /**
   * The latest valid date that can be used.
   * Do NOT combine with restrictDates, as they set the same underlying values.
   */
  @Input()
  set dateRangeEnd(dt: Date) {
    // Set time on date to 00:00:00 for comparing later
    this._dateRangeEnd = dt ? startOfDay(dt) : null;
    // console.log( 'set dateRangeEnd: ', dt, this._dateRangeEnd );
  }

  public monthList: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  monthLabelforId: string = 'month_' + this.objectId;
  dayLabelforId: string = 'day_' + this.objectId;
  yearLabelforId: string = 'year_' + this.objectId;

  // Abstact variable defined
  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    dayOutOfRange: `Invalid ${LabelReplacementTag}.`,
    yearDistantPast: `Invalid ${LabelReplacementTag}.`,
    yearDistantFuture: `Invalid ${LabelReplacementTag}.`,
    noPastDatesAllowed: `Invalid ${LabelReplacementTag}.`,
    noFutureDatesAllowed: `Invalid ${LabelReplacementTag}.`,
    invalidValue: `Invalid ${LabelReplacementTag}.`,
    invalidRange: `Invalid ${LabelReplacementTag}.`
  };

  private today = startOfToday();
  private tomorrow = addDays( this.today, 1 );
  public isRequired: boolean; // TODO: remove if not required - value does not get set when using Reactive forms

  constructor( @Optional() @Self() public controlDir: NgControl,
               @Optional() @Self() @Inject(NG_VALIDATORS) private injectedValidators: any[] ) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    /*
     * Works, creates new object literall
     * obj = {
     *   errorMessage: 'new'message';
     * }
     *
     * Doesn't work, modifies existing object.  Would have to manually call cd.detectChanges() afterwards.
     * obj.errorMessage = 'newMessage';
     */
    if (changes['errorMessage']) {
      this.setErrorMsg();
    }
  }

  ngOnInit() {
    this.setErrorMsg();

    // Set to midnight, so we don't accidentally compare against hours/minutes/seconds

    if (this.restrictDate !== 'any' && (this._dateRangeEnd || this._dateRangeStart)) {
      const msg = `<common-date> - Invalid @Input() option configuration.
You cannot use "[restrictDate]" in combination with either  "[dateRangeEnd]" or "[dateRangeStart]".
You must use either [restrictDate] or the [dateRange*] inputs.

    <common-date name='effectiveDate'
        label="Effective Date"
        [restrictDate]="'past'"   <<< problem, choose one
        [dateRangeEnd]='today'    <<< problem, choose one
        formControlName="effectiveDate"
    ></common-date>

  `;
      throw new MoHCommonLibraryError(msg);
    }

    // Initialize date range logic
    if (this.restrictDate === 'past') {
      // past does allow for today
      this._dateRangeEnd = this.today;
      this._dateRangeStart = null;
    } else if (this.restrictDate === 'future') {
      // future does NOT allow for today
      this._dateRangeEnd = null;
      this._dateRangeStart = this.tomorrow;
    }

    this.registerValidation( this.controlDir, this.validateSelf )
      .then(_ => {
        if (this.injectedValidators && this.injectedValidators.length) {
          // TODO: Potentially move to AbstractFormControl
          // Inspect the validator functions for one that has a {required: true}
          // property. Importantly, we are inspecting the validator function
          // itself and NOT the current state of the NgControl. -- Does not work for reactive forms
          this.isRequired = this.injectedValidators
            .filter(x => x.required)
            .length >= 1;

          // console.log( 'isRequired: ', this.isRequired );
        }
      });
  }

  get month(): number {
    if (this.date) {
      return this.date.getMonth();
    }
  }

  get day(): number {
    if (this.date) {
      return this.date.getDate();
    }
  }

  get year(): number {
    if (this.date) {
      return this.date.getFullYear();
    }
  }

  /**
   * Handles creating / destroying date and emitting changes based on user behaviour.
   */
  private processDate() {

    this._onTouched(this.date);

    if (this.canCreateDate()) {
      const year = this.getNumericValue(this._year);
      const month = this.getNumericValue(this._month);
      const day = this.getNumericValue(this._day);
      // console.log('CREATING DATE', { year, month, day });

      // Date function appears to use setYear() so any year 0-99 results in year 1900 to 1999
      // Set each field individually, use setFullYear() instead of setYear()
      // Set time on date to 00:00:00 for comparing later
      this.date = startOfDay(new Date());
      this.date.setMonth(month);
      this.date.setFullYear(year); // To correct year when value has less than 4 characters
      this.date.setDate(day);

      this._triggerOnChange(this.date);
    } else {
      this.destroyDate();
    }
  }

  /**
   * Destroys the internal Date object.  This should always be used instead of nulling out `this.date` directly.
   */
  private destroyDate() {

    // Trigger validator for emptying fields use case. This is to remove the 'Invalid date' error.
    if (this.date ||
       (!this._year && !this._day && this._month === 'null')) {
      this.date = null;
    }

    this._triggerOnChange(this.date);
  }

  /**
   * Returns true if and only if the day/month/year fields are all filled out.
   */
  private canCreateDate(): boolean {

    // special because "0" is valid (Jan)
    const monthCheck = (typeof this._month === 'string' && this._month !== 'null')
      || typeof this._month === 'number';

    if (!!this._year && !!this._day && monthCheck) {
      return true;
    }
  }

  private _triggerOnChange( dt: Date ) {
    this._onChange(dt);
    this.dateChange.emit(dt);
  }

  /** Convert string to numeric value or null if not */
  private getNumericValue(value: string): number | null {
    const parsed = parseInt(value, 10);
    return (isNaN(parsed) ? null : parsed);
  }


  private setDisplayVariables() {
    this._day = this.date.getDate().toString();
    this._month = this.date.getMonth().toString();
    this._year = this.date.getFullYear().toString();
  }

  writeValue(value: Date): void {
    if (value) {
      this.date = value;
      this.setDisplayVariables();
    }
  }

  onBlurDay(value: string) {
    this._day = value;
    this.processDate();
  }
  onBlurYear(value: string) {
    this._year = value;
    this.processDate();
  }
  onBlurMonth(value: string) {
    this._month = value;
    this.processDate();
  }

  /**
   * Validates the DateComponent instance itself, using internal private variables.
   *
   */
  private validateSelf() {
    const year = parseInt(this._year, 10);
    const month = parseInt(this._month, 10);
    const day = parseInt(this._day, 10);
    // console.log('validateDate', { year, month, day });

    // Nothing empty fields - nothing to validate OR have required error
    if ( isNaN(year) && isNaN(month) && isNaN(day) ) {
      return null;
    }

    // Partially filled out is always invalid, if year is present it must be greater than zero
    if ( isNaN(year) || isNaN(month) || isNaN(day) || (!isNaN( year) && year <= 0) ) {
      return {invalidValue: true};
    }

    // We can hardcode the day, since we're only interested in total days for that month.
    const daysInMonth = getDaysInMonth(new Date(year, month, 1));
    if (day > daysInMonth || day < 1) {
      return { dayOutOfRange: true };
    }

    const dateRangeResult = this.validateRange();
    if (dateRangeResult) {
      return dateRangeResult;
    }

    const distantDatesResult = this.validateDistantDates();
    if (distantDatesResult) {
      return distantDatesResult;
    }

    return null;
  }


  // If you set restrictDate, it will return noFutureDatesAllowed / noPastDatesAllowed
  // If you just set dateRangeStart / dateRangeEnd, you get invalidRange
  private validateRange(): ValidationErrors | null {

    const _dt = startOfDay( this.date );

    if (this._dateRangeEnd && isAfter(_dt, this._dateRangeEnd)) {
      // console.log( 'isAfter(this.date, this.dateRangeEnd): ',
       // isAfter(this.date, this._dateRangeEnd) , this.date, this._dateRangeEnd);

      if (this.restrictDate === 'past' ||
          compareAsc(this._dateRangeEnd, this.today) === 0) {
        return {noFutureDatesAllowed: true};
      }

      return {invalidRange: true};
    }

    if (this._dateRangeStart && isBefore(_dt, this._dateRangeStart)) {

      // console.log( 'isBefore(this.date, this.dateRangeStart): ',
      //   isBefore(this.date, this._dateRangeStart) , this.date, this._dateRangeStart);
      if (this.restrictDate === 'future'  ||
          compareAsc(this._dateRangeStart, this.tomorrow) === 0) {
        return {noPastDatesAllowed: true};
      }

      return {invalidRange: true};
    }

    return null;
  }

  private validateDistantDates(): ValidationErrors | null {

    // console.log( 'validateDistantDates: ', distantFuture, distantPast, this.date );

    // Null end range only allow 150 years in future
    if (!this._dateRangeEnd && isAfter(this.date, distantFuture)) {
      return {yearDistantFuture: true};
    }

    // Null start range only allow 150 years in past
    if (!this._dateRangeStart && isBefore(this.date, distantPast)) {
      return {yearDistantPast: true};
    }

    return null;
  }

}
