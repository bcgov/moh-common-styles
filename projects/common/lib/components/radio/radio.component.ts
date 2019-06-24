import {Component, EventEmitter, Input, Output, Optional, Self} from '@angular/core';
import {Base} from '../../models/base';
import {ControlValueAccessor, NgControl} from '@angular/forms';

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
@Component({
  selector: 'common-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent extends Base implements ControlValueAccessor {


  @Input() radioLabels: Array<{label: string, value: string}> ;
  @Input() checked: boolean = false; // TODO: Remove after confirm not used
  @Input() disabled: boolean = false;
  @Input() label: string ;
  @Input() value: string ;
  @Input() showError: boolean;
  @Input() errorMessageRequired: string = this.label + ' is required.';
  @Input() display: 'table-row-group' | 'inline-block'  = 'inline-block';

  @Output() statusChange: EventEmitter<string> = new EventEmitter<string>();

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  setStatus(evt: string) {
    // this.value = evt;
    this._onChange(evt);
    this.statusChange.emit(evt);
    this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
