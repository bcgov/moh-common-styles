import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Base } from '../../models/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CANADA } from '../country/country.component';

export const BRITISH_COLUMBIA = 'BC';
export interface ProvinceList {
  provinceCode: string;
  description: string;
  country: string;
}

export const PROVINCE_LIST: ProvinceList[] = [
  { provinceCode: 'AB', description: 'Alberta', country: CANADA },
  { provinceCode: 'BC', description: 'British Columbia', country: CANADA },
  { provinceCode: 'MB', description: 'Manitoba', country: CANADA },
  { provinceCode: 'NB', description: 'New Brunswick', country: CANADA },
  { provinceCode: 'NL', description: 'Newfoundland and Labrador', country: CANADA },
  { provinceCode: 'NS', description: 'Nova Scotia', country: CANADA },
  { provinceCode: 'ON', description: 'Ontario', country: CANADA },
  { provinceCode: 'PE', description: 'Prince Edward Island', country: CANADA },
  { provinceCode: 'QC', description: 'Quebec', country: CANADA },
  { provinceCode: 'SK', description: 'Saskatchewan', country: CANADA },
  { provinceCode: 'NT', description: 'Northwest Territories', country: CANADA },
  { provinceCode: 'NU', description: 'Nunavut', country: CANADA },
  { provinceCode: 'YT', description: 'Yukon', country: CANADA }
];

@Component({
  selector: 'common-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Province';
  @Input() provinceList: ProvinceList[] = PROVINCE_LIST;
  @Input() labelforId: string = 'province_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Please select a province';
  @Input() maxlen: string = '250';
  @Input() useDropDownList: boolean = true;

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.province = val;
    }
  }
  get value() {
    return this.province;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  province: string;

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  onValueChange( value: any ) {
    if ( value !== this.province ) {
      this._onChange( value );
      this.valueChange.emit( value );
      this.province = value;
    }
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.province = value;
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
