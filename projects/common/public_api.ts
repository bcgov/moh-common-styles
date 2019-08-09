/*
 * Public API Surface of moh-common-styles
 *
 * - This is only for the main entry point, i.e. `moh-common-lib`
 * - Does *NOT* cover secondary entry points like `moh-common-lib/models`
 */

export * from './lib/shared-core.module';

// Interfaces
export { CountryList, CANADA, UNITED_STATES, COUNTRY_LIST, getCountryDescription } from './lib/components/country/country.component';
export { ProvinceList, BRITISH_COLUMBIA, PROVINCE_LIST, getProvinceDescription } from './lib/components/province/province.component';
export { ConsentModalComponent } from './lib/components/consent-modal/consent-modal.component';
export { SimpleDate } from './lib/models/simple-date.interface';
export { AddrLabelList , Maxlengths } from './lib/components/address/address.component';


// Models
export * from './lib/models/container';
export { AbstractForm } from './lib/models/abstract-form';
export { Address } from './lib/models/address.model';
export { Base } from './lib/models/base';
export { Person } from './lib/models/person.model';
export { MaskModel, LETTER, NUMBER, SPACE } from './lib/models/mask.model';

// Services
export * from './lib/services/abstract-api-service';
export * from './lib/services/geocoder.service';
export * from './lib/services/logger.service';
export * from './lib/services/check-complete-base.service';
export * from './lib/services/route-guard.service';
export * from './lib/services/abstract-pg-check.service';

// Validators
export { commonValidateName } from './lib/components/name/validate-name.directive';
export { commonValidateBcPostal } from './lib/components/postal-code/validate-bc-postal.directive';
export { commonValidateSin } from './lib/components/sin/validate-sin.directive';
export { commonValidatePhn } from './lib/components/phn/validate-phn.directive';
export { commonDuplicateCheck } from './lib/components/duplicate-check/duplicate-check.directive';
