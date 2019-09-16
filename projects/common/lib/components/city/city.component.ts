import { Component, OnInit, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Base } from '../../models/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorMessage } from '../../../public_api';

@Component({
  selector: 'common-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent extends Base implements OnInit, ControlValueAccessor  {

  @Input() label: string = 'City';
  @Input() maxlen: string = '100';
  @Input() labelforId: string = 'city_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'City name';
  @Input() errorMessage: ErrorMessage;

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.city = val;
    }
  }
  get value() {
    return this.city;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  city: string = '';

  defaultErrMsg: ErrorMessage = {
    required: 'is required.',
    invalidChar: 'must contain letters and may include numbers and special characters ' +
                 'such as hyphens, periods, apostrophes and blank characters.'
  };

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.setErrorMsg();
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
      this.city = value;
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

  private setErrorMsg() {
    if ( this.errorMessage ) {
      Object.keys(this.errorMessage).map( x => this.defaultErrMsg[x] = this.errorMessage[x] );
    }
  }
}
