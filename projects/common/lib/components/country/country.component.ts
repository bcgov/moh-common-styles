import { Component, OnInit, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Base } from '../../../models/src/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/** Interface for countries */
export interface CountryList {
  countryCode: string;
  description: string;
}

@Component({
  selector: 'common-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Country';
  @Input() countryList: CountryList[];
  @Input() labelforId: string = 'country' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  country: string = null;

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
    this.blurEvent.emit( event.target.value );
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
      this.country = value;
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
