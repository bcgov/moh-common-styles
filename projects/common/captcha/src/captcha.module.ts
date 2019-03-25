import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// import { AppComponent } from './app.component';
import { CaptchaComponent } from './captcha.component';
import { CaptchaDataService } from './captcha-data.service';

@NgModule({
  declarations: [
    // AppComponent,
    CaptchaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    CaptchaDataService
  ],

  exports: [
    CaptchaComponent
  ],
  // bootstrap: [AppComponent]
})
export class CaptchaModule { }
