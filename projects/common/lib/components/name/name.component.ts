import {
  Component,
  Input,
  Optional,
  Self,
  Output,
  EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Base } from '../../models/base';

@Component({
  selector: 'common-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent extends Base implements ControlValueAccessor {

  @Input() disabled: boolean = false;
  @Input() label: string = 'Name';
  @Input() maxlen: string = '255';
  @Input() labelforId: string = 'name_' + this.objectId;

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.nameStr = val;
    }
  }
  get value() {
    return this.nameStr;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  public nameStr: string = '';

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
      this.nameStr = value;
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

  displayErrors(): boolean {
    const displayErr = this.controlDir && !this.controlDir.disabled &&
    ( this.controlDir.dirty || this.controlDir.touched );
    return displayErr;
  }
}
