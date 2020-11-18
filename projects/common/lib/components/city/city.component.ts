import { Component, OnInit, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';

@Component({
  selector: 'common-city',
  templateUrl: './city.component.html',
})
export class CityComponent extends AbstractFormControl implements OnInit, ControlValueAccessor  {

  @Input() label: string = 'City';
  @Input() maxlength: string = '100';
  @Input() labelforId: string = 'city_' + this.objectId;
  @Input() placeholder: string = 'City name';

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.city = val;
    }
  }
  get value() {
    return this.city;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  city: string = '';

  _defaultErrMsg: ErrorMessage = {
    required: LabelReplacementTag + ' is required.',
    invalidChar: LabelReplacementTag + ' must contain letters and may include numbers and special characters ' +
                 'such as hyphens, periods, apostrophes and blank characters.'
  };

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onValueChange( value: string ) {
    this.city = value;
    this._onChange( value );
    this.valueChange.emit( value );
  }

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event );
  }

  writeValue( value: string ): void {
    if ( value !== undefined ) {
      this.city = value;
    }
  }
}
