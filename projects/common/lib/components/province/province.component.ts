import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Base } from '../../../models/src/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';


export interface ProvinceList {
  country: string;
  provinceCode: string;
  description: string;
}

@Component({
  selector: 'common-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Province';
  @Input() provinceList: ProvinceList[];
  @Input() labelforId: string = 'province_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Please select a province';
  @Input() maxlen: string = '250';
  @Input() useDropDownList: boolean = true;

  @Input()
  set value( val: string ) {
    this.province = val;
  }
  get value() {
    return this.province;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  province: string = null;

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  onValueChange( value: any ) {
    this._onChange( value );
    this.valueChange.emit( value );
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
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
