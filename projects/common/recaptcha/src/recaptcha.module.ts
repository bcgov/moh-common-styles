import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { RecaptchaComponent } from './recaptcha.component';
import { RecaptchaDataService } from './recaptcha-data.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RecaptchaComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    RecaptchaDataService
  ],
  exports: [
    RecaptchaComponent
  ],
})
export class ReCaptchaModule {
  static forRoot(): ModuleWithProviders<ReCaptchaModule> {
    return {
      ngModule: ReCaptchaModule,
      providers: [RecaptchaDataService]
    };
  }
}
