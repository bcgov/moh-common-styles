# Angular Recaptcha Component
A user interface component built using the Angular web application framework designed to adapt Google Recaptcha to replace the pre-existing captcha component.

## Integration:
First install the moh-common-lib package on the command line with:  npm -i moh-common-lib
Make the following changes to the component that is going to integrate the Recaptcha component (herein referred to as the host component).

### Module File
In the module file to which the host component belongs the Recaptcha module must be imported.
1) At the top of the file, with the other import statements, add the following line:
    ```ts
    import { ReCaptchaModule } from 'moh-common-lib/recaptcha'
    ```
2) Add ReCaptchaModule to the list of imports under NGModule.
    #### Example:
    ```ts
    @NgModule({
    declarations: [...exportables],
    imports: [
        SomeOtherModule,
        ReCaptchaModule,
    ],
    exports: [
        SharedCoreModule,
        ...exportables
    ]
    })
    ```

### Html File
In the html file of the host component add the following lines between the opening and closing tags of the host  (may require modification to adjust for a given implementation):
```html
  <common-recaptcha *ngIf="isRecaptchaEnabled && showCaptcha"
      [apiBaseUrl]="recaptchaApiBaseUrl"
      [nonce]="nonce"
      [publicKey]="recaptchaPublicKey"
      (onValidToken)="handleToken($event)"></common-recaptcha>
```
This version only displays if the isRecaptchaEnabled variable is true.  This is intended for use as a feature flag to select between using captcha or recaptcha components.

### Main Component File(ts file)
The following code example shows the integration of Recaptcha into an example host component.  In the class definition for the host component(in the component.ts file) add the recaptcha variables and functions as shown below.  This example assumes the use of a feature flag SPA_ENV_ENABLE_RECAPTCHA used to enable/disable the use of recaptcha.  To use this an environment variable by the same name must be set to "true" or "false" on the spa-env-service pod, and the SpaEnvService must be imported above and included in the constructor as a parameter.
```ts
export class HostComponent implements AfterViewInit {
  //recaptcha variables
  recaptchaApiBaseUrl: string = PATH_TO_RECAPTCHA_SERVICE;
  nonce: string = UUID.UUID();
  recaptchaPublicKey:string = "REPLACE_WITH_PUBLIC_KEY_FROM_GOOGLE";
  showCaptcha:boolean = true;//hides recaptcha once complete
  @Output() validToken: EventEmitter<string> = new EventEmitter<any>();
  //END recaptcha variables

  constructor(private spaEnvService: SpaEnvService){}

  //recaptcha functions
  /**
  * isRecaptchaEnabled - returns true if reCaptcha is used
  * and false if captcha is used.
  */
  get isRecaptchaEnabled(): boolean {
    const env = this.spaEnvService.getValues();
    return env && env.SPA_ENV_ENABLE_RECAPTCHA === 'true';
  }

  /**
  * handleToken - recieves a Maximus token from the captcha
  * or recaptcha components and passes it through to the
  * main application
  * @param token - a Maximus token to confirm the user is a
  * human.
  */
  handleToken(token: string) {
    this.showCaptcha = false;
    this.validToken.emit(token); // Use the token as needed by the application
  }
  //END recaptcha functions
}
```
PATH_TO_RECAPTCHA_SERVICE is likely to be stored in the environment, but it is just the path to communicate with the recaptcha service.

REPLACE_WITH_PUBLIC_KEY_FROM_GOOGLE should be filled in with the public key provided by Google.  The private key will be used via an environment variable on the recaptcha service.
