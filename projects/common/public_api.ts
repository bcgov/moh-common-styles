/*
 * Public API Surface of moh-common-styles
 *
 * - This is only for the main entry point, i.e. `moh-common-lib`
 */

export * from './lib/shared-core.module';

// Components - only include components imported into Typescript files.
export { SampleModalComponent, SampleImageInterface } from './lib/components/sample-modal/sample-modal.component';
export { ConsentModalComponent } from './lib/components/consent-modal/consent-modal.component';

// Interfaces
export { CountryList, CANADA, UNITED_STATES, COUNTRY_LIST, getCountryDescription } from './lib/components/country/country.component';
export { ProvinceList, BRITISH_COLUMBIA, PROVINCE_LIST, getProvinceDescription } from './lib/components/province/province.component';
export { AddrLabelList , Maxlengths } from './lib/components/address/address.component';
export { ApiStatusCodes } from './lib/components/confirm-template/confirm-template.component';

// Models
export * from './lib/models/container';
export * from './lib/models/abstract-form-control';
export { AbstractForm } from './lib/models/abstract-form';
export { AbstractReactForm } from './lib/models/abstract-react-form';
export { Address } from './lib/models/address.model';
export { Base } from './lib/models/base';
export { Person } from './lib/models/person.model';
export { LETTER, NUMBER, SPACE } from './lib/models/mask.constants';
export { ErrorMessage, LabelReplacementTag } from './lib/models/error-message.interface';
export * from './lib/models/images.model';

// Services
export * from './lib/services/abstract-api-service';
export * from './lib/services/geocoder.service';
export * from './lib/services/logger.service';
export * from './lib/services/page-state.service';
export * from './lib/services/abstract-page-guard.service';
export * from './lib/services/load-page-guard.service';
export * from './lib/services/default-page-guard.service';

export * from './lib/services/container.service';

// Validators
export { commonValidateName } from './lib/components/name/validate-name.directive'; // TODO: remove - name component self validates
export { commonValidateBcPostal } from './lib/components/postal-code/validate-bc-postal.directive';
export { commonDuplicateCheck } from './lib/components/duplicate-check/duplicate-check.directive';
export { commonValidateStreet } from './lib/components/street/validate-street.directive';
export { commonValidateCity } from './lib/components/city/validate-city.directive';
export { commonValidateRegion } from './lib/components/validate-region/validate-region.directive';
export { commonValidatePostalcode } from './lib/components/postal-code/validate-postalcode.directive';

// Helpers
export { scrollToError, scrollTo } from './helpers/scroll-helpers';
