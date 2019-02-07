import { NgModule } from '@angular/core';
import { CommonComponent } from './common.component';
import { PasswordComponent } from './components/password/password.component';
import { FormsModule, NgForm, ControlContainer } from '@angular/forms';
import { CommonModule as ngCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FormsModule,
    ngCommonModule,
    RouterModule,
  ],
  declarations: [
    CommonComponent,
    PasswordComponent,
  ],
  exports: [
    CommonComponent,
    PasswordComponent,
  ],
  providers: [
    NgForm,
  ]
})
export class CommonModule { }
