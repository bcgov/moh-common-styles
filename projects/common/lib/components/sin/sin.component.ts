import { Component, EventEmitter, Input, Output, Optional, Self} from '@angular/core';
import { Base } from '../../../models/src/base';
import { NUMBER, SPACE } from '../../../models/src/mask.model';
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
  @Input() sinList: string[] = [];

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
    console.log( 'onValueChange: ', value, this.sin );

    if ( value !== this.sin ) { // IE fix when focus does not display required error
      this._onChange( value );
      this.valueChange.emit( value );
      this.sin = value;
    }
  }

  onBlurEvent( event: any ) {
    console.log( 'onblur: ', event );

    if ( event.target.value ) {
      const sinValid = this.validateSIN( event.target.value );
      console.log( 'sinValid: ', sinValid, event.target.value );

      if ( this.controlDir ) {
        this.controlDir.control.setErrors(( sinValid ? null : { 'pattern': true } ));
      }

      // Duplicate Sin check
      if ( sinValid && this.sinList && this.sinList.length ) {

        const duplicate = this.sinList.find( x => x === event.target.value );
        console.log( 'duplicate sin: ', duplicate );
        if ( this.controlDir ) {
          this.controlDir.control.setErrors(( duplicate ? { 'duplicate': true } : null ));
        }
      }
    }

    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    console.log( 'writeValue: ', value, this.sin );
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

  private validateSIN( sin: string ): boolean {

    // pre req checks
    if (sin === null || sin === undefined || sin.length < 1) {
      return false;
    }

    // Init weights and other stuff
    const weights: number[] = [1, 2, 1, 2, 1, 2, 1, 2, 1];
    let sum = 0;

    // Clean up string
    sin = sin.trim();

    // Rip off spaces a regex
    const regexp = new RegExp('[ ]', 'g');
    sin = sin.replace(regexp, '');

    // Test for length
    if (sin.length !== 9) {
      return false;
    }


    // Walk through each character
    for (let i = 0; i < sin.length; i++) {

      // pull out char
      const char = sin.charAt(i);

      // parse the number
      const num = Number(char);
      if (Number.isNaN(num)) {
        return false;
      }

      // multiply the value against the weight
      let result = num * weights[i];

      // If two digit result, substract 9
      if (result > 9) {
        result = result - 9;
      }

      // add it to our sum
      sum += result;
    }

    // The sum must be divisible by 10
    if (sum % 10 !== 0) {
      return false;
    }

    // All done!
    return true;
  }
}
