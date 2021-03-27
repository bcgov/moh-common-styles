import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreBreadcrumbComponent } from './components/core-breadcrumb/core-breadcrumb.component';
import { FormActionBarComponent } from './components/form-action-bar/form-action-bar.component';
import { PageFrameworkComponent } from './components/page-framework/page-framework.component';
import { WizardProgressBarComponent } from './components/wizard-progress-bar/wizard-progress-bar.component';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { RouterModule } from '@angular/router';
import { DateComponent } from './components/date/date.component';
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
import { AddressComponent } from './components/address/address.component';
import { CountryComponent } from './components/country/country.component';
import { ProvinceComponent } from './components/province/province.component';
import { CityComponent } from './components/city/city.component';
import { StreetComponent } from './components/street/street.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { NameComponent } from './components/name/name.component';
import { PhoneNumberComponent } from './components/phone-number/phone-number.component';
import { RadioComponent } from './components/radio/radio.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AccordionCommonComponent } from './components/accordion/accordion.component';
import { ValidateNameDirective } from './components/name/validate-name.directive';
import { SinComponent } from './components/sin/sin.component';
import { PhnComponent } from './components/phn/phn.component';
import { FullNameComponent } from './components/full-name/full-name.component';
import { HeaderComponent } from './components/header/header.component';
import { ValidateBcPostalDirective } from './components/postal-code/validate-bc-postal.directive';
import { XiconButtonComponent } from './components/xicon-button/xicon-button.component';
import { DuplicateCheckDirective } from './components/duplicate-check/duplicate-check.directive';
import { ErrorContainerComponent } from './components/error-container/error-container.component';
import { ValidateStreetDirective } from './components/street/validate-street.directive';
import { ValidateCityDirective } from './components/city/validate-city.directive';
import { ValidateRegionDirective } from './components/validate-region/validate-region.directive';
import { ValidatePostalcodeDirective } from './components/postal-code/validate-postalcode.directive';
import { SampleModalComponent } from './components/sample-modal/sample-modal.component';
import { EmailComponent } from './components/email/email.component';
import { ConfirmTemplateComponent } from './components/confirm-template/confirm-template.component';
import { GeocoderInputComponent } from './components/geocoder-input/geocoder-input.component';
import { DateFieldFormatDirective } from './components/date/date-field-format.directive';
import { AddressValidatorComponent } from './components/address-validator/address-validator.component';


const componentList = [
  CoreBreadcrumbComponent,
  FormActionBarComponent,
  PageFrameworkComponent,
  WizardProgressBarComponent,
  DateComponent,
  DatepickerComponent,
  FileUploaderComponent,
  ThumbnailComponent,
  FormSubmitBarComponent,
  PostalCodeComponent,
  PageSectionComponent,
  DropdownComponent,
  ToggleComponent,
  AddressComponent,
  CountryComponent,
  ProvinceComponent,
  CityComponent,
  StreetComponent,
  ButtonGroupComponent,
  ButtonComponent,
  CheckboxComponent,
  ConsentModalComponent,
  NameComponent,
  FullNameComponent,
  PhoneNumberComponent,
  RadioComponent,
  AccordionCommonComponent,
  SinComponent,
  PhnComponent,
  HeaderComponent,
  XiconButtonComponent,
  ErrorContainerComponent,
  SampleModalComponent,
  EmailComponent,
  ConfirmTemplateComponent,
  GeocoderInputComponent,
  AddressValidatorComponent,


  // Directives
  ValidateNameDirective,
  DuplicateCheckDirective,
  ValidateBcPostalDirective,
  ValidateStreetDirective,
  ValidateCityDirective,
  ValidateRegionDirective,
  ValidatePostalcodeDirective,
  DateFieldFormatDirective
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    RouterModule,
    NgxMyDatePickerModule.forRoot(),
    ModalModule.forRoot(),
    TextMaskModule,
    NgSelectModule,
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [
    componentList,
  ],
  exports: [
    componentList
  ],
  providers: [
    NgForm
  ]
})
export class SharedCoreModule { }
