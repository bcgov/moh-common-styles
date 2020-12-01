import { Component, Input, Output, EventEmitter, Optional, Self, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { LETTER, NUMBER, SPACE } from '../../models/mask.constants';
import { Base } from '../../models/base';
import { ErrorMessage } from '../../../public_api';


@Component({
  selector: 'common-postal-code',
  templateUrl: './postal-code.component.html',
  styleUrls: ['./postal-code.component.scss']
})
export class PostalCodeComponent extends Base implements OnInit, ControlValueAccessor  {

  @Input() label: string = 'Postal Code';
  @Input() displayMask: boolean = true;
  @Input() maxlen: string = '250';
  @Input() labelforId: string = 'postalCode_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() errorMessage: ErrorMessage;

  @Input()
  set value( val: string ) {
    if (val) {
      this.postalCode = val;
    }
  }
  get value() {
    return this.postalCode;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  postalCode: string = '';
  mask: any;

  defaultErrMsg: ErrorMessage = {
    required: 'is required.',
    invalidChar: 'must contain letters and/or numbers and may include blank characters.',
    pattern: 'Must be in the format A1A 1A1',
    invalidBCPostal: 'Invalid postal code for British Columbia.'
  };

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }

    this.mask = [LETTER, NUMBER, LETTER, SPACE, NUMBER, LETTER, NUMBER];
  }

  ngOnInit() {
    this.setErrorMsg();
  }

  onValueChange( value: any ) {

    if ( value !== this.postalCode ) { // IE fix when focus does not display required error
      this._onChange( value );
      this.valueChange.emit( value );
      this.postalCode = value;
    }
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
      this.postalCode = value;
    }
  }

  // Register change functiong
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

  /**
   * Upper cases letters in string
   */
  upperCasePipe(text: string) {
    return text.toUpperCase();
  }

  private setErrorMsg() {
    if ( this.errorMessage ) {
      Object.keys(this.errorMessage).map( x => this.defaultErrMsg[x] = this.errorMessage[x] );
    }
  }
}
