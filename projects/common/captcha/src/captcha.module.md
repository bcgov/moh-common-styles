# CAPTCHA Module

Example:

```
import { CaptchaModule } from 'moh-common-lib/captcha'
@NgModule({
    declarations: [ ... ],
    providers: [ ... ],
    imports: [
        ...
        CaptchaModule
    ]
})
```

    import { CaptchaModule } from 'moh-common-lib/captcha';

    @NgModule({
        declarations: [ ... ],
        providers: [ ... ],
        imports: [
            ...
            CaptchaModule
        ]
    })

Then register your application module and use `<common-captcha>`

    // tip: set nonce to a UUID().
    <common-captcha [apiBaseUrl]="captchaApiBaseUrl"
                 [nonce]="nonce"
                 (onValidToken)="setToken($event)"
                 [successMessage]="'  '"></common-captcha>


There must be a configured CAPTCHA service deployed to OpenShift to use this component. You then must point apiBaseUrl to point to the service.


# Known Issues