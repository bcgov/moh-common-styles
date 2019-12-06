import {
  Component,
  Input,
  Optional,
  Self,
  Output,
  EventEmitter,
  OnInit} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { LabelReplacementTag, ErrorMessage } from '../../models/error-message.interface';

/**
 * TODO DOCUMENT NEED TO USE NGMODEL FOR REQUIRED TO WORK. Also test with reactive forms to see if still nec
 */
@Component({
  selector: 'common-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent extends AbstractFormControl implements OnInit, ControlValueAccessor {

  @Input() disabled: boolean = false;
  @Input() label: string = 'Name';
  @Input() maxlength: string = '255';
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
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  public nameStr: string = '';

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalid: LabelReplacementTag + ' must begin with a letter and cannot include special ' +
      'characters except hyphens, periods, apostrophes and blank characters.',
    invalidChar: `${LabelReplacementTag} must be a letter.` // for Initials when maxlength is 1
  };


  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();

    this.registerValidation( this.controlDir, this.validateSelf );
  }

  onValueChange( value: any ) {
    this.nameStr = value;
    this._onChange( value );
    this.valueChange.emit( value );
  }

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event.target.value );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.nameStr = value;
    }
  }

  get maxLenAsNumber(): number {
    return Number.parseInt( this.maxlength, 10 );
  }

  private validateSelf(): ValidationErrors | null {

    const maxlen = Number.parseInt( this.maxlength, 10 );

    console.log( 'name validate self: ', this.nameStr );

    if ( this.nameStr ) {
      if ( maxlen > 1 ) {
        // Valid characters for name
        const criteria: RegExp = RegExp( '^[a-zA-Z][a-zA-Z\-.\' ]*$' );
        return criteria.test( this.nameStr ) ? null : { 'invalid': true };
      } else {

        // Only letters for initials
        const letters: RegExp = RegExp( '[a-zA-Z]*$' );
        return letters.test( this.nameStr ) ? null : { 'invalidChar': true };
      }
    }
    return null;
   }

}
