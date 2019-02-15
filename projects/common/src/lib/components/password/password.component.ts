import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnChanges, Directive } from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, NgForm } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';

/**
 * NPM package dependencies:
 *  a) zxcvbn
 *  b) FormsModule
 */

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
  required: string;
  minLength?: string;
  criteria?: string;
}
@Component({
  selector: 'common-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PasswordComponent extends Base implements OnInit, OnChanges {

  // Inputs for the component
  @Input() componentLabel: string;
  @Input() isRequired: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() password: string;
  @Input() minLen: string  = '8';
  @Input() maxLen: string  = '32';
  @Input() pswdCriteria: string;
  @Input() errorMessages: PasswordErrorMsg;
  @Input() showPasswordStrength: boolean = false;


  // Output from the component
  @Output() onPasswordChange: EventEmitter<string> = new EventEmitter<string>();

  // Flag for the fa-eye to show or hide password
  public hideValue = true;
  public pswdStrength: number;
  public strengthPercentage = 0;

  constructor( private form: NgForm ) {
    super();
  }

  ngOnInit() {
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
    this.onPasswordChange.emit( password );
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
