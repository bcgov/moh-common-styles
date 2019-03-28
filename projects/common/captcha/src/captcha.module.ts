import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CaptchaComponent } from './captcha.component';
import { CaptchaDataService } from './captcha-data.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CaptchaComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    CaptchaDataService
  ],
  exports: [
    CaptchaComponent
  ],
})
export class CaptchaModule { 
  static forRoot(): ModuleWithProviders<CaptchaModule> {
    return {
      ngModule: CaptchaModule,
      providers: [CaptchaDataService]
    }
  }
}
