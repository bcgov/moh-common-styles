import { Component, EventEmitter, Input, Output, Optional, Self} from '@angular/core';
import { Base } from '../../models/base';
import { NUMBER, SPACE } from '../../models/mask.model';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'common-sin',
  templateUrl: './sin.component.html',
  styleUrls: ['./sin.component.scss']
})
export class SinComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Social Insurance Number (SIN)';
  @Input() maxlen: string = '15';
  @Input() placeholder: string = '111 111 111';
  @Input() labelforId: string = 'sin_' + this.objectId;
  @Input() disabled: boolean = false;

  @Input()
  set value( val: string ) {
    console.log( 'set value: ', val );
    if ( val ) {
      this.sin = val;

      console.log( 'value: ', this.sin );
    }
  }
  get value() {
    console.log( 'get value: ', this.sin );
    return this.sin;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  sin: string = '';
  mask: any;

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }

    this.mask =
    [NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  }

  onValueChange( value: any ) {

    if ( value !== this.sin ) { // IE fix when focus does not display required error
      this._onChange( value );
      this.valueChange.emit( value );
      this.sin = value;
    }
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.sin = value;
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
}
