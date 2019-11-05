import {Component, EventEmitter, Input, Output, Optional, Self, OnInit, forwardRef} from '@angular/core';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { LabelReplacementTag, ErrorMessage } from '../../models/error-message.interface';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * RadioComponent is a single radio which can be used to have multiple radios
 * based on the radio label values.
 *
 * To display radio in a vertical style use display="table-row-group" by default
 * it shows in horizontal or inline display, display='inline-block' You can
 * have many radio's and the number is based on the Radio label Value. For 3
 * radio buttons, radioLabels value should be passed in the below format
 *
 *
 *      [
 *             {
 *               "label": "Myself only",
 *               "value": "MyselfOnly"
 *             },
 *             {
 *               "label": "All members on my MSP account",
 *               "value": "AllMembers"
 *             },
 *             {
 *               "label": "One specific member on my MSP account",
 *               "value": "SpecificMember"
 *             }
 *      ];
 *
 * @example
 *        <common-radio #gender [value]="person.gender"
 *          label='Gender' display='table-row-group'
 *          [radioLabels]='[{"label": "Male", "value": "Male"},{ "label": "Female", "value": "Female"}]'
 *          (statusChange)="onChange.emit($event)"
 *          [showError]="showError">
 *        </common-radio>
 *
 * @export
 *
 */
export interface IRadioItems {
  label: string;
  value: any;
}
@Component({
  selector: 'common-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent extends AbstractFormControl implements OnInit {

  _value: any = '';
  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`
  };

  @Input() radioLabels: IRadioItems[] = [
    {label: 'No', value: false},
    {label: 'Yes', value: true}
  ];

  @Input() label: string;
  @Input()
  set value( val: string ) {
    this._value = val;
  }
  get value() {
    return this._value;
  }

  @Input() display: 'table-row-group' | 'inline-block'  = 'inline-block';
  @Input() instructionText: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<any>();

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setStatus(val: any) {
    this._value = val;

    this._onChange(val);
    this._onTouched();
    this.valueChange.emit(val);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this._value = value;
  }
}
