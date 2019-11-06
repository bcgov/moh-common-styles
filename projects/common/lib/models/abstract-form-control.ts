import { ErrorMessage, replaceLabelTag } from './error-message.interface';
import { Input, OnInit } from '@angular/core';
import { Base } from './base';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

// Class does not get exported - used internally
export abstract class AbstractFormControl extends Base implements OnInit, ControlValueAccessor {

  // Default messages - must be defined in each component
  abstract _defaultErrMsg: ErrorMessage = {};

  // Must be defined in component as default labels are specific to component
  @Input() abstract label: string;

  @Input() disabled: boolean = false;

  // Input to allow developers to change default messages
  @Input() errorMessage: ErrorMessage;


  // Required for implementing ControlValueAccessor
  _onChange = (_: any) => {};
  _onTouched = (_?: any) => {};


  ngOnInit() {
    this.setErrorMsg();
  }

  // Required for implementing ControlValueAccessor
  abstract writeValue( value: any ): void;

  // Register change function
  registerOnChange( fn: any ): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched( fn: any ): void {
    this._onTouched = fn;
  }

  // Disable control
  setDisabledState( isDisabled: boolean ): void {
    this.disabled = isDisabled;
  }

  protected setErrorMsg() {
    // Some components have logic based off no label being submitted
    const _label = this.label ? this.label : 'Field';

    if ( this.errorMessage ) {
      Object.keys(this.errorMessage).map( x => this._defaultErrMsg[x] = this.errorMessage[x] );
    }

    // Replace label tags with label
    Object.keys(this._defaultErrMsg).map( x => this._defaultErrMsg[x] = replaceLabelTag( this._defaultErrMsg[x] , _label ) );
  }

  /**
   * Register self validating method
   * @param control control directive
   * @param fn function for validating self
   */
  protected registerValidation( ngControl: NgControl, fn: ValidationErrors ) {

    // Register validateSelf validator so that it will be added on component initialization.
    // Makes the component a self validating component.
    Promise.resolve().then(() => {

      if ( ngControl ) {

        const allValidators = [fn.bind(this)];
        if ( ngControl.control.validator ) {
          allValidators.push( ngControl.control.validator );
        }
        ngControl.control.setValidators(allValidators);
        ngControl.control.updateValueAndValidity();
      }
    });
  }
}
