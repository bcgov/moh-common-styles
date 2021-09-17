import { Component, OnInit, Renderer2, Output, Input,EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecaptchaDataService } from './recaptcha-data.service';

@Component({
  selector: 'common-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.css']
})
export class RecaptchaComponent implements OnInit {

  @Input('apiBaseUrl') apiBaseUrl: string;
  @Input('nonce') nonce: string;
  @Input('publicKey') publicKey: string;
  @Input('language') language: string = 'en';

  @Output() onValidToken = new EventEmitter<string>();

  GENERIC_ERROR_MESSAGE:string = 'Could not connect to reCAPTCHA service. Please try again later.';
  errorVerifyAnswer:string = null;

  constructor( private dataService: RecaptchaDataService, private _renderer: Renderer2, private _http: HttpClient ) { }

  ngOnInit():void {
    let script = this._renderer.createElement('script');
    script.defer = true;
    script.async = true;
    script.src = "https://www.google.com/recaptcha/api.js";
    this._renderer.appendChild(document.body, script);
  }

  /**
   * resolved - called by google reCAPTCHA
   *  when evaluation completes
   * @param token - a token from google that
   *  can be validated by recaptcha service
   */
  resolved(token:string){
    this.dataService.verifyRecaptcha(this.apiBaseUrl, this.nonce, token)
      .subscribe(response => {
        const payload:any = response.body;
        if (this.isValidPayload(payload)) {
          this.onValidToken.emit(payload.jwt);
        } else {
          this.errorVerifyAnswer = this.GENERIC_ERROR_MESSAGE;
        }
      }, error => {
        console.error("recaptcha service connection error:", error);
        this.errorVerifyAnswer = this.GENERIC_ERROR_MESSAGE;
      });
  }

  /**
   * isValidPayload - checks the payload returned by recaptcha-service
   * @param payload
   * @returns:boolean - true if recaptcha-service has
   * validated successfully
   */
  private isValidPayload(payload) {
    if (!payload) {
      //improper responce from recaptcha-service
      console.error('payload cannot be null or undefined or 0');
      return false;
    } else {
      const hasValidProp = payload.hasOwnProperty('valid');
      if (!hasValidProp || payload.valid === false) {
        //the submitted reCAPTCHA token failed validation
        console.error('Error verifying captcha');
        return false;
      } else {
        //the submitted reCAPTCHA token was confirmed valid
        return true;
      }
    }
  }
}
