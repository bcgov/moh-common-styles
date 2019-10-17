import { Component, OnInit, Input, Output, EventEmitter, Optional, Self, OnDestroy, AfterViewInit, ContentChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NgModelGroup } from '@angular/forms';
import { Base } from '../../models/base';
import { SimpleDate } from '../../models/simple-date.interface';
import * as moment_ from 'moment';
import {
  ErrorMessage,
  LabelReplacementTag,
  replaceLabelTag
} from '../../models/error-message.interface';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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

@Component({
  selector: 'common-ng-date',
  templateUrl: './ng-date.component.html',
  styleUrls: ['./ng-date.component.scss']
})
export class NgDateComponent extends Base
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor  {

  @ContentChild(NgModelGroup) private _group: NgModelGroup;

  private _subscription: Subscription;

  _date: SimpleDate = { year: null, month: null, day: null };
  _monthList = [
    { idx: '1', name: 'January' },
    { idx: '2', name: 'February' },
    { idx: '3', name: 'March' },
    { idx: '4', name: 'April' },
    { idx: '5', name: 'May' },
    { idx: '6', name: 'June' },
    { idx: '7', name: 'July' },
    { idx: '8', name: 'August' },
    { idx: '9', name: 'September' },
    { idx: '10', name: 'October' },
    { idx: '11', name: 'November' },
    { idx: '12', name: 'December' },
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

  @Input() useCurrentDate: boolean = false;
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Date';

  /** Can be one of: "future", "past". "future" includes today, "past" does not. */
  @Input() restrictDate: 'future' | 'past' | 'any' = 'any';
  @Input() errorMessages: ErrorMessage;

  @Input()
  set value( val: SimpleDate ) {
    console.log( 'set value: ', val );
    if ( val ) {
      this._date.year = val.year !== undefined ? val.year : null;
      this._date.month = val.month !== undefined ? val.month : null;
      this._date.day = val.day !== undefined ? val.day : null;
    }
  }
  get value(): SimpleDate {
    console.log( 'get value: ', this._date );
    return this._date;
  }
  @Output() valueChange: EventEmitter<SimpleDate> = new EventEmitter<SimpleDate>();
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();

    console.log( 'constructor: ', controlDir );
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    console.log( 'onInit date component' );

    this.setErrorMsg();

    if ( this.useCurrentDate ) {
      this._date = { year: moment().month(), month: moment().month() + 1, day: moment().date() };
    }
  }

  ngAfterViewInit() {

    if ( this.controlDir ) {
      this._subscription = this.controlDir.valueChanges.pipe(
        debounceTime( 100 )
      ).subscribe(() => {
        console.log( '_date: ', this._date );

       // this._onChange( this._date );
       // this.valueChange.emit( this._date );
      });
    }
  }

  ngOnDestroy() {
    if ( this.controlDir ) {
      this._subscription.unsubscribe();
    }
  }

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event );
  }

  writeValue( value: SimpleDate ): void {
    console.log( 'writeValue date component', value );
    if ( value ) {
     // this._date.year = value.year !== undefined ? value.year : null;
     // this._date.month = value.month !== undefined ? value.month : null;
     // this._date.day = value.day !== undefined ? value.day : null;
     // this._onChange( this._date);
    }
  }

  registerOnChange(fn: any): void {
   this._onChange = fn;
   // this.controlDir.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private setErrorMsg() {
    if ( this.errorMessages ) {
      Object.keys(this.errorMessages).map( x => this.defaultErrMsg[x] = this.errorMessages[x] );
    }
    Object.keys(this.defaultErrMsg).map( x => this.defaultErrMsg[x] = replaceLabelTag( this.defaultErrMsg[x] , this.label ) );
  }
}
