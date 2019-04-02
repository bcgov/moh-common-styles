import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreBreadcrumbComponent } from './components/core-breadcrumb/core-breadcrumb.component';
import { FormActionBarComponent } from './components/form-action-bar/form-action-bar.component';
import { PageFrameworkComponent } from './components/page-framework/page-framework.component';
import { PasswordComponent } from './components/password/password.component';
import { WizardProgressBarComponent } from './components/wizard-progress-bar/wizard-progress-bar.component';
import { NgForm, FormsModule } from '@angular/forms';
import { ProgressbarModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { DateComponent } from './components/date/date.component';
import { DayValidationDirective } from './components/date/day-validation.directive';
import { DateFieldFormatDirective } from './components/date/date-field-format.directive';
import { YearValidateDirective } from './components/date/year-validate.directive';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { FormSubmitBarComponent } from './components/form-submit-bar/form-submit-bar.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PostalCodeComponent } from './components/postal-code/postal-code.component';
import { PageSectionComponent } from './components/page-section/page-section.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleComponent } from './components/toggle/toggle.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProgressbarModule.forRoot(),
    RouterModule,
    NgxMyDatePickerModule.forRoot(),
    ModalModule.forRoot(),
    TextMaskModule,
    NgSelectModule
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
    YearValidateDirective,
    DatepickerComponent,
    FileUploaderComponent,
    ThumbnailComponent,
    FormSubmitBarComponent,
    PostalCodeComponent,
    PageSectionComponent,
    DropdownComponent,
    ToggleComponent
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
    YearValidateDirective,
    DatepickerComponent,
    FileUploaderComponent,
    ThumbnailComponent,
    FormSubmitBarComponent,
    PostalCodeComponent,
    PageSectionComponent,
    DropdownComponent,
    ToggleComponent
  ],
  providers: [
    NgForm
  ]
})
export class SharedCoreModule { }
