import {
  Component,
  Input,
  Optional,
  Self,
  Output,
  EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Base } from '../../models/base';

/**
 * TODO DOCUMENT NEED TO USE NGMODEL FOR REQUIRED TO WORK. Also test with reactive forms to see if still nec
 */
@Component({
  selector: 'common-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent extends Base implements ControlValueAccessor {

  @Input() disabled: boolean = false;
  @Input() label: string = 'Email';
  @Input() maxlength: string = '255';
  @Input() labelforId: string = 'email_' + this.objectId;

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.email = val;
    }
  }
  get value() {
    return this.email;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  public email: string = '';

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
    if ( value ) {
      this.email = value;
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

  get maxLenAsNumber(): number {
    return Number.parseInt( this.maxlength, 10 );
  }
}
