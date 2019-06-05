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
  @Input() phnList: string[] = [];

  @Input()
  set value( val: string ) {
    console.log( 'set value: ', val );
    if ( val) {
      this.phn = val;
    }
  }
  get value() {
    console.log( 'get value: ', this.phn );
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
    console.log( 'onValueChange: ', value, this.phn );

    if ( value !== this.phn ) { // IE fix when focus does not display required error
      this._onChange( value );
      this.valueChange.emit( value );
      this.phn = value;
    }
  }

  onBlurEvent( event: any ) {
    console.log( 'onblur: ', event );

    if ( event.target.value ) {
      const phnValid = this.validatePHN( event.target.value );
      console.log( 'phnValid: ', phnValid, event.target.value );

      if ( this.controlDir ) {
        this.controlDir.control.setErrors(( phnValid ? null : { 'pattern': true } ));
      }

      // Duplicate PHN check
      if ( phnValid && this.phnList && this.phnList.length ) {

        const duplicate = this.phnList.find( x => x === event.target.value );
        console.log( 'duplicate phn: ', duplicate );
        if ( this.controlDir ) {
          this.controlDir.control.setErrors(( duplicate ? { 'duplicate': true } : null ));
        }
      }
    }

    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    console.log( 'writeValue: ', value, this.phn );
    if ( value ) {
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

  // Empty value (null, undefined, empty string) are treated as invalid.
  private validatePHN( phn: string, isBCPhn: boolean = true, allowEmptyValue: boolean = false ): boolean {
    // pre req checks
    if (phn === null || phn === undefined || phn.trim().length < 1) {
      return allowEmptyValue;
    }

    // Init weights and other stuff
    const weights: number[] = [-1, 2, 4, 8, 5, 10, 9, 7, 3, -1];
    let sumOfRemainders = 0;

    // Clean up string
    phn = phn.trim();

    // Rip off leading zeros with a regex
    let regexp = new RegExp('^0+');
    phn = phn.replace(regexp, '');

    // remove spaces
    regexp = new RegExp('[ ]', 'g');
    phn = phn.replace(regexp, '');

    // Test for length
    if (phn.length !== 10) {
      return false;
    }
    // Look for a number that starts with 9 if BC only
    if (isBCPhn && phn[0] !== '9') {
      return false;
    } else if (!isBCPhn &&
      phn[0] === '9') { // Number cannot have 9
      return false;
    }

    // Walk through each character
    for (let i = 0; i < phn.length; i++) {

      // pull out char
      const char = phn.charAt(i);

      // parse the number
      const num = Number(char);
      if (Number.isNaN(num)) {
        return false;
      }

      // Only use the multiplier if weight is greater than zero
      let result = 0;
      if (weights[i] > 0) {
        // multiply the value against the weight
        result = num * weights[i];

        // divide by 11 and save the remainder
        result = result % 11;

        // add it to our sum
        sumOfRemainders += result;
      }
    }

    // mod by 11
    const checkDigit = 11 - (sumOfRemainders % 11);

    // if the result is 10 or 11, it is an invalid PHN
    if (checkDigit === 10 || checkDigit === 11) {
      return false;
    }

    // Compare against 10th digit
    const finalDigit = Number(phn.substring(9, 10));
    if (checkDigit !== finalDigit) {
      return false;
    }

    // All done!
    return true;
  }
}
