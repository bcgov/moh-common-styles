import { Component, EventEmitter, Input, Output, Optional, Self} from '@angular/core';
import { Base } from '../../models/base';
import { NUMBER, SPACE } from '../../models/mask.model';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'common-phn',
  templateUrl: './phn.component.html',
  styleUrls: ['./phn.component.scss']
})
export class PhnComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Personal Health Number (PHN)';
  @Input() maxlen: string = '15';
  @Input() placeholder: string = '1111 111 111';
  @Input() labelforId: string = 'phn_' + this.objectId;
  @Input() disabled: boolean = false;


  @Input()
  set value( val: string ) {
    if ( val) {
      this.phn = val;
    }
  }
  get value() {
    return this.phn;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  phn: string = '';
  mask: any;

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }

    this.mask =
    [NUMBER, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  }

  onValueChange( value: any ) {

    if ( value !== this.phn ) { // IE fix when focus does not display required error
      this._onChange( value );
      this.valueChange.emit( value );
      this.phn = value;
    }
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
      this.phn = value;
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
