import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreBreadcrumbComponent } from './components/core-breadcrumb/core-breadcrumb.component';
import { FormActionBarComponent } from './components/form-action-bar/form-action-bar.component';
import { PageFrameworkComponent } from './components/page-framework/page-framework.component';
import { PasswordComponent } from './components/password/password.component';
import { WizardProgressBarComponent } from './components/wizard-progress-bar/wizard-progress-bar.component';
import { NgForm, FormsModule } from '@angular/forms';
import { ProgressbarModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { DateComponent } from './components/date/date.component';
import { DayValidationDirective } from './components/date/day-validation.directive';
import { DateFieldFormatDirective } from './components/date/date-field-format.directive';
import { YearValidateDirective } from './components/date/year-validate.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProgressbarModule.forRoot(),
    RouterModule
  ],
  declarations: [
    CoreBreadcrumbComponent,
    FormActionBarComponent,
    PageFrameworkComponent,
    PasswordComponent,
    WizardProgressBarComponent,
    DateComponent,
    DayValidationDirective,
    DateFieldFormatDirective,
    YearValidateDirective
  ],
  exports: [
    CoreBreadcrumbComponent,
    FormActionBarComponent,
    PageFrameworkComponent,
    PasswordComponent,
    WizardProgressBarComponent,
    DateComponent,
    DayValidationDirective,
    DateFieldFormatDirective,
    YearValidateDirective
  ],
  providers: [
    NgForm
  ]
})
export class SharedCoreModule { }
