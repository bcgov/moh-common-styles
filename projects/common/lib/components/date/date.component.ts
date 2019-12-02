import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional, Self, SimpleChanges, OnChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidationErrors} from '@angular/forms';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addYears from 'date-fns/addYears';
import subYears from 'date-fns/subYears';
import subDays from 'date-fns/subDays';
import { MoHCommonLibraryError } from '../../../helpers/library-errorr';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { compareAsc } from 'date-fns';

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

  dayTouched: boolean = false;
  monthTouched: boolean = false;
  yearTouched: boolean = false;


  /**
   * The earliest valid date that can be used.
   * Do NOT combine with restrictDates, as they set the same underlying values.
   */
  @Input() dateRangeStart: Date;
  /**
   * The latest valid date that can be used.
   * Do NOT combine with restrictDates, as they set the same underlying values.
   */
  @Input() dateRangeEnd: Date;

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
  private yesterday = subDays(startOfToday(), 1);

  constructor( @Optional() @Self() public controlDir: NgControl ) {
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
    if (changes['errorMessages']) {
      this.setErrorMsg();
    }
  }

  ngOnInit() {
    this.setErrorMsg();

    // Set to midnight, so we don't accidentally compare against hours/minutes/seconds

    if (this.restrictDate !== 'any' && (this.dateRangeEnd || this.dateRangeStart)) {
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
      // past does NOT allow for today
      this.dateRangeEnd = this.yesterday;
      this.dateRangeStart = null;
    } else if (this.restrictDate === 'future') {
      // future DOES allow for today
      this.dateRangeEnd = null;
      this.dateRangeStart = this.today;
    }


    // Register validateSelf validator so that it will be added on component initialization.
    // Makes the component a self validating component.
    Promise.resolve().then(() => {

      if (this.controlDir) {

        const allValidators = [this.validateSelf.bind(this)];
        if ( this.controlDir.control.validator ) {
          allValidators.push( this.controlDir.control.validator );
        }
        this.controlDir.control.setValidators(allValidators);
        this.controlDir.control.updateValueAndValidity();
      }
    });

  }

  get month(): number {
    if (this.date) {
      return this.date.getMonth();
    }
  }

  setMonth(value: string): void {
    const month = this.getNumericValue(value);
    // console.log('set-month', { month, value });
    this._month = value;
    this.monthTouched = true;
    if (this.date) {
      this.dateChange.emit(this.date);
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
   // console.log('seDay', value, this.date);
    const day = this.getNumericValue(value);
    // console.log('set-day', {day, value});
    this._day = value;
    this.dayTouched = true;
    if (this.date) {
      this.dateChange.emit(this.date);
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
    const year = this.getNumericValue(value);
    // console.log('set-year', {year, value});
    this._year = value;
    this.yearTouched = true;
    if (this.date) {
      this.dateChange.emit(this.date);
      this.date.setFullYear(year);
    }
    this.processDate();
  }

  /**
   * Handles creating / destroying date and emitting changes based on user behaviour.
   */
  private processDate() {
    if (this.canCreateDate()) {
      const year = this.getNumericValue(this._year);
      const month = this.getNumericValue(this._month);
      const day = this.getNumericValue(this._day);
      // console.log('CREATING DATE', { year, month, day });

      // Date function appears to use setYear() so any year 0-99 results in year 1900 to 1999
      // Set each field individually, use setFullYear() instead of setYear()
      this.date = new Date();
      this.date.setFullYear(year);
      this.date.setMonth(month);
      this.date.setDate(day);
      this._onChange(this.date);
      this.dateChange.emit(this.date);
    } else {
      this.destroyDate();
    }
  }

  /**
   * Destroys the internal Date object.  This should always be used instead of nulling out `this.date` directly.
   */
  private destroyDate() {
    if (this.date) {
      this.date = null;
      this._onChange(null);
      this.dateChange.emit(null);
    }
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


  /** Convert string to numeric value or null if not */
  private getNumericValue(value: string): number | null {
    const parsed = parseInt(value, 10);
    return (isNaN(parsed) ? null : parsed);
  }


  private setDisplayVariables() {
    this._day = this.date.getDate().toString();
    this._month = this.date.getMonth().toString();
    this._year = this.date.getFullYear().toString();

    this.monthTouched = true;
    this.yearTouched = true;
    this.dayTouched = true;
  }

  writeValue(value: Date): void {
    if (value) {
      this.date = value;
      this.setDisplayVariables();
    }
  }

  onBlurDay(value: string) {
    this.dayTouched = true;
    this.handleBlur();
    this.setDay(value);
  }
  onBlurYear(value: string) {
    this.yearTouched = true;
    this.handleBlur();
    this.setYear(value);
  }
  onBlurMonth(value: string) {
    this.monthTouched = true;
    this.handleBlur();
    this.setMonth(value);
  }
  handleBlur() {
    if (this.dayTouched && this.yearTouched && this.monthTouched) {
      this._onTouched(this.date);
    }
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

    // if they're all NaN, it means each field is empty
    const allFieldsEmpty = isNaN(year) && isNaN(month) && isNaN(day);
    const someFieldsEmpty = isNaN(year) || isNaN(month) || isNaN(day);

    // Partially filled out is always invalid, if year is present it must be greater than zero
    if (!allFieldsEmpty && someFieldsEmpty || (!isNaN( year) && year <= 0) ) {
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
    if (this.dateRangeEnd && isAfter(this.date, this.dateRangeEnd)) {

      if (this.restrictDate === 'past' ||
          compareAsc(this.dateRangeEnd, this.yesterday) === 0) {
        return {noFutureDatesAllowed: true};
      }

      return {invalidRange: true};
    }

    if (this.dateRangeStart && isBefore(this.date, this.dateRangeStart)) {

      if (this.restrictDate === 'future'  ||
          compareAsc(this.dateRangeStart, this.today) === 0) {
        return {noPastDatesAllowed: true};
      }

      return {invalidRange: true};
    }

    return null;
  }

  private validateDistantDates(): ValidationErrors | null {

    // console.log( 'validateDistantDates: ', distantFuture, distantPast, this.date );

    if (isAfter(this.date, distantFuture)) {
      return {yearDistantFuture: true};
    }

    if (isBefore(this.date, distantPast)) {
      return {yearDistantPast: true};
    }

    return null;
  }

}
