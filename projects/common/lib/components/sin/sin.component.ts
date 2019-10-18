import { Component, EventEmitter, Input, Output, Optional, Self} from '@angular/core';
import { NUMBER, SPACE } from '../../models/mask.model';
import { NgControl } from '@angular/forms';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { LabelReplacementTag, ErrorMessage } from '../../models/error-message.interface';

/**
 * This component reports the following errors.
 *    required
 *    invalid
 *    duplicate
 *
 *  These messages can be changed by updated messages using the errorMessages interface
 *  Ex. { required: 'This field is required', invalid: '{label} is invalid' }
 */

@Component({
  selector: 'common-sin',
  templateUrl: './sin.component.html',
  styleUrls: ['./sin.component.scss']
})
export class SinComponent extends AbstractFormControl {

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalid: `${LabelReplacementTag} is invalid.`,
    duplicate: `${LabelReplacementTag} was already used for another family member.`
  };

  sin: string = '';
  mask: any;

  @Input() label: string = 'Social Insurance Number (SIN)';
  @Input() maxlength: string = '15';
  @Input() placeholder: string = '111 111 111';
  @Input() labelforId: string = 'sin_' + this.objectId;

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
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();


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

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event );
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
