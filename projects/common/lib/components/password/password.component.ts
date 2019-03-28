import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnChanges, Directive, forwardRef } from '@angular/core';
import { Base } from '../../../models/src/base';
import { ControlContainer, NgForm } from '@angular/forms';
import * as zxcvbn_ from 'zxcvbn';
// Awkward necessary workaround due to bug in build tools
// https://github.com/jvandemo/generator-angular2-library/issues/221#issuecomment-355945207
const zxcvbn = zxcvbn_;

/**
 * Interface for passing in error messages
 * Example:
 *  errorMessages = {
 *       required: this.componentLabel + ' is required.',
 *       minLength: this.componentLabel + ' must be ' + this.minLen + ' characters.',
 *       criteria: this.componentLabel + ' does not meet password criteria.'
 *     }
 */
export interface PasswordErrorMsg {
  required?: string;
  minLength?: string;
  criteria?: string;
}
/**
 * PasswordComponent is a text input for a user's password. It includes:
 *
 * - A password strength bar
 * - Minimum length validations
 *
 * Note - if your application has requirements to check things like username is not
 * present in password, we recommend doing this in the (passwordChange) callback.
 *
 * @example
 *       <common-password componentLabel="{{newPwdLabel}}"
 *                      [showPasswordStrength]="true"
 *                      [minLen]="pwdMinLen"
 *                      [pwdCriteria]="pwdValidChars"
 *                      [password]="data.password"
 *                      (passwordChange)="setNewPassword($event)"></common-password>
 *
 * @export
 */
@Component({
  selector: 'common-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class PasswordComponent extends Base implements OnInit, OnChanges {

  // Inputs for the component
  @Input() label: string = 'Password';
  @Input() isRequired: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() password: string;
  @Input() pwdCriteria: string | RegExp;
  @Input() minLen: string  = '8';
  @Input() maxLen: string  = '32';
  @Input() errorMessages: PasswordErrorMsg;
  @Input() showPasswordStrength: boolean = false;
  @Input() objectID: string = 'password_' + this.objectId;


  // Output from the component
  @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter();

  // Flag for the fa-eye to show or hide password
  public hideValue = true;
  public pswdStrength: number;
  public strengthPercentage = 0;

  public errMsg: PasswordErrorMsg;

  // default messages
  private requiredMsgSeg: string = ' is required.';
  private minLenMsgSeg1: string = ' must be at least ';
  private minLenMsgSeg2: string = ' characters in length.';
  private criteriaMsg: string = ' contains invalid characters.';


  constructor() {
    super();
  }

  ngOnInit() {

    // Set default messages
    this.errMsg =    {
      required: this.label + this.requiredMsgSeg,
      minLength: this.label + this.minLenMsgSeg1 + this.minLen + this.minLenMsgSeg2,
      criteria: this.label + this.criteriaMsg
    };

    // Replace default message if provided
    if ( this.errorMessages ) {

      if ( this.errorMessages.required ) {
        this.errMsg.required = this.errorMessages.required;
      }

      if ( this.errorMessages.minLength ) {
        this.errMsg.minLength = this.errorMessages.minLength;
      }

      if ( this.errorMessages.criteria ) {
        this.errMsg.criteria = this.errorMessages.criteria;
      }
    }
  }

  ngOnChanges(changes) {
    if (changes.password && this.password) {

      // Check strength of password
      this.pswdStrength = this.getPasswordStrength( this.password );
      this.strengthPercentage = ((this.pswdStrength + 1) / 5 ) * 100;
    }
  }

  /**
   * Passes the value entered back to the calling component
   * @param password value the was entered by
   */
  setPassword( password: string ) {
    this.passwordChange.emit( password );
  }

  onInputBlur($event) {
    console.log( 'onBlur: ', event );
    this.blurEvent.emit( event );
  }

  // Prevent user from pasting data into the text box
  @HostListener( 'document:paste', ['$event'] )
  onPaste( event ) {
      return false;
  }

  /**
   * Get the strength of the password

   *    0 = too guessable: risky password. (guesses < 10^3)
   *    1 = very guessable: protection from throttled online attacks. (guesses < 10^6)
   *    2 = somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
   *    3 = safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
   *    4 = very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
   *
   *  https://github.com/dropbox/zxcvbn
   */
  private getPasswordStrength( password: string ): number {
    // Password strength feedback
    const pswdFeedback = zxcvbn( password );
    return pswdFeedback.score;
  }
}
