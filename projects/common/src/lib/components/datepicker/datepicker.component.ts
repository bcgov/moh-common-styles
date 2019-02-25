import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { INgxMyDpOptions, IMyDate, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import * as moment_ from 'moment';
const moment = moment_;


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
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, OnChanges {
  /** Component size can be reduced, see Datepickersizes for options */
  @Input() size: DatepickerSizes = DatepickerSizes.DEFAULT;
  @Input() date: Date;
  @Output() dateChange = new EventEmitter<Date>();
  @Input() disabled: boolean;
  @Input() labelText: string;


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

  /** Datetime model used to interface with ngx-datepicker. */
  // model: any;
  model: any;

  // Make enum accessible in HTML
  DatepickerSizes: typeof DatepickerSizes = DatepickerSizes;

  @ViewChild('dp') ngxdp: NgxMyDatePickerDirective;

  /** Default options for wrapped ngx-datepicker. */
  datepickerOptions: INgxMyDpOptions;

  constructor() { }

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

    this.loadModel();
  }

  private loadModel() {
    // workaround added to handle both date formats
    if (this.date instanceof Date) {
      this.model = {
        //  date: this.date
        jsdate: this.date
      };
    } else {
      this.model = {
        date: this.date
        //  jsdate: this.date
      };
    }
    // Mini needs to have the formatted field set to display the initial text.
    if (this.size === DatepickerSizes.MINI && this.date instanceof Date) {
      this.model.formatted = moment(this.date).format(this.dateFormat.toUpperCase());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Parent component has passed in null, so we have to manually clear the input. This leads to 2 change detection cycles.
    // We could refactor it down to one, but the performance hit is minimal for such a simple component.
    if (this.date === null) {
      this.clearDate();
    } else {
      // If another datecomponent has editted the date, we need to re-load our
      // model to reflect changes in this component
      this.loadModel();
    }
  }

  onDateChanged(event): void {
    if (event.jsdate || event.jsdate === null) {
      // Always emit a Date (or null)
      this.dateChange.emit(event.jsdate);
    }
  }

  clearDate() {
    if (this.ngxdp) {
      // We don't need to emit here, because by changing date we'll trigger onDateChanged automatically.
      this.date = null;
      this.ngxdp.clearDate();
    }
  }

  get hasValidDate(): boolean {
    // Can be improved in the future, now we just check if we have a formatted date string.
    return !!(this.date);
  }

}

export enum DatepickerSizes {
  MINI = 'mini',
  DEFAULT = 'default'
}
