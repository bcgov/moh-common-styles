import {
  Component,
  Input,
  Optional,
  Self,
  Output,
  EventEmitter,
  OnInit} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { Base } from '../../models/base';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';

/**
 * TODO DOCUMENT NEED TO USE NGMODEL FOR REQUIRED TO WORK. Also test with reactive forms to see if still nec
 */
@Component({
  selector: 'common-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent extends AbstractFormControl implements OnInit {

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
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  email: string = '';

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalidEmail: 'Invalid email format.'
  };

  private criteria: RegExp = /^(\S+)@(\S+)\.(\S+)$/;

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
    this.email = value;
    this._onChange( value );
    this.valueChange.emit( value );
  }

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event.target.value );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.email = value;
    }
  }

  private validateSelf(): ValidationErrors | null {

    if ( this.email ) {
      const result = this.criteria.test( this.email );
      return result ? null : { invalidEmail: true };
    }
    return null;
  }
}
