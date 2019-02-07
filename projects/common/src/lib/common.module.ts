import { NgModule } from '@angular/core';
import { CommonComponent } from './common.component';
import { PasswordComponent } from './components/password/password.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as ngCommon } from '@angular/common';

@NgModule({
  imports: [
    FormsModule,
    ngCommon
  ],
  declarations: [
    CommonComponent,
    PasswordComponent,
  ],
  exports: [
    CommonComponent,
    PasswordComponent
  ]
})
export class CommonModule { }
