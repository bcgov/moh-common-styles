import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnChanges, forwardRef } from '@angular/core';
import { INgxMyDpOptions, IMyDate, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { NgForm, ControlContainer, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Base } from '../../models/base';

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


/**
 * PRIME datepicker component. Largely a wrapper for ngx-mydatepicker
 * https://github.com/kekeh/ngx-mydatepicker
 *
 * NOTE - YOU MUST INCLUDE NGX-MYDATEPICKER IN YOUR PARENT APPLICATION TO USE
 * THIS COMPONENT!  This is due to some poor implementation in ngx-mydatepicker.
 * Make sure to use the same version that this library uses.
 */
@Component({
  selector: 'common-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatepickerComponent)
    }
  ]
})
export class DatepickerComponent extends Base implements OnInit, OnChanges, ControlValueAccessor {
  /** Component size can be reduced, see Datepickersizes for options */
  @Input() size: DatepickerSizes = DatepickerSizes.DEFAULT;
  @Input() date: Date;
  @Output() dateChange = new EventEmitter<Date>();
  @Input() disabled: boolean;
  @Input() labelText: string;

  @Input() required: boolean = false;


  /** Dates **before** disableUntil will not be valid selections.  Maps to a ngx-mydatepicker option, but we convert IMyDate to Date  */
  @Input() disableUntil: Date;

  /** Dates **after** disableSince will not be valid selections.  Maps to a ngx-mydatepicker option, but we convert IMyDate to Date */
  @Input() disableSince: Date;

  /** Equivalent to setting disableBefore to tomorrow. */
  @Input() onlyFutureDates: boolean;

  /**
   * Control visibility of the clear 'x' button on the mini datepicker.
   *
   * **'visible'** is default, button exists
   *
   * **'none'** means the element does not exist
   *
   * **'invisible'** means the element takes up space but is not visible / cannot be
   * used.
   *
   * Invisible is useful when you want to make sure a datepicker is the same
   * size as a visible one.
   */
  @Input() clearButton: 'visible' | 'invisible' | 'none' = 'visible';



  /** Format for how to display the date to the user. */
  @Input() dateFormat: string = 'yyyy/mm/dd';

  @Input() errorMessages: DateErrorMsg;

  /** Datetime model used to interface with ngx-datepicker. */
  // model: any;
  model: any;

  // Make enum accessible in HTML
  DatepickerSizes: typeof DatepickerSizes = DatepickerSizes;

  @ViewChild('dp') ngxdp: NgxMyDatePickerDirective;

  /** Default options for wrapped ngx-datepicker. */
  datepickerOptions: INgxMyDpOptions;

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor() {
    super();
   }

  convertDateToSimpleDate(date: Date): IMyDate {
    if (date === null || date === undefined) { return null; }
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  convertSimpleDateToDate(date: IMyDate): Date {
    // When ngx-mydatepicker is cleared, it returns {year: 0, month: 0, day: 0}
    if (date.year === 0) {
      return null;
    }
    return new Date(date.year, date.month - 1, date.day);
  }

  isDate(x: any): x is Date {
    if (!x) { return false; }
    return x.getDate !== undefined;
  }

  ngOnInit() {
    if (!this.errorMessages) {
      this.errorMessages = {
        required: this.labelText + ' is required.',
        dayOutOfRange: 'Invalid ' + this.labelText + '.',
        yearDistantPast: 'Invalid ' + this.labelText + '.',
        yearDistantFuture: 'Invalid ' + this.labelText + '.',
        noFutureDatesAllowed: 'Invalid ' + this.labelText + '.',
        invalidValue: 'Invalid ' + this.labelText + '.'
      };
    }

    this.datepickerOptions = {
      dateFormat: this.dateFormat,
      sunHighlight: false,
      appendSelectorToBody: true,
    };

    if (this.size === DatepickerSizes.MINI) {
      // Set width/height to 4/5 of default
      this.datepickerOptions.selectorHeight = '185px';
      this.datepickerOptions.selectorWidth = '201px';
    }

    if (this.isDate(this.disableSince)) {
      this.datepickerOptions.disableSince = this.convertDateToSimpleDate(this.disableSince);
    }

    if (this.isDate(this.disableUntil)) {
      this.datepickerOptions.disableUntil = this.convertDateToSimpleDate(this.disableSince);
    }

    if (this.onlyFutureDates) {
      const today = new Date();
      this.datepickerOptions.disableUntil = this.convertDateToSimpleDate(today);
    }


    if (this.date) {
      // Even if jsdate winds up being undefined, even defining this.model will
      // set the input as non-empty and it'll satisfy the 'required' validation.
      // So, we only add the model if there's actual data.
      this.model = {
        jsdate: this.date
      };
    }


  }


  ngOnChanges(changes: SimpleChanges) {
    // Parent component has passed in null, so we have to manually clear the input. This leads to 2 change detection cycles.
    // We could refactor it down to one, but the performance hit is minimal for such a simple component.
    if (this.date === null) {
      this.clearDate();
      this._onChange(null);
      this._onTouched();
    }
  }

  onDateChanged(event): void {
    if (event.jsdate || event.jsdate === null) {
      // Always emit a Date (or null)
      this.dateChange.emit(event.jsdate);
      this._onChange(event.jsdate);
      this._onTouched();
    }
  }

  clearDate() {
    if (this.ngxdp) {
      // We don't need to emit here, because by changing date we'll trigger onDateChanged automatically.
      this.date = null;
      this.ngxdp.clearDate();
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this.model = {
      jsdate: obj
    };
  }

}

export enum DatepickerSizes {
  MINI = 'mini',
  DEFAULT = 'default'
}
