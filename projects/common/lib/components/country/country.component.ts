import { Component, Input, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Base } from '../../models/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/** Interface for countries */
export interface CountryList {
  countryCode: string;
  description: string;
}

export const CANADA = 'CAN';
export const UNITED_STATES = 'USA';

/** Default list of countries */
export const COUNTRY_LIST: CountryList[] = [
  { countryCode: 'AFG', description: 'Afghanistan' },
  { countryCode: 'ALA', description: 'Åland Islands' },
  { countryCode: 'ALB', description: 'Albania' },
  { countryCode: 'DZA', description: 'Algeria' },
  { countryCode: 'ASM', description: 'American Samoa' },
  { countryCode: 'AND', description: 'Andorra' },
  { countryCode: 'AGO', description: 'Angola' },
  { countryCode: 'AIA', description: 'Anguilla' },
  { countryCode: 'ATA', description: 'Antarctica' },
  { countryCode: 'ATG', description: 'Antigua and Barbuda' },
  { countryCode: 'ARG', description: 'Argentina' },
  { countryCode: 'ARM', description: 'Armenia' },
  { countryCode: 'ABW', description: 'Aruba' },
  { countryCode: 'AUS', description: 'Australia' },
  { countryCode: 'AUT', description: 'Austria' },
  { countryCode: 'AZE', description: 'Azerbaijan' },
  { countryCode: 'BHS', description: 'Bahamas' },
  { countryCode: 'BHR', description: 'Bahrain' },
  { countryCode: 'BGD', description: 'Bangladesh' },
  { countryCode: 'BRB', description: 'Barbados' },
  { countryCode: 'BLR', description: 'Belarus' },
  { countryCode: 'BEL', description: 'Belgium' },
  { countryCode: 'BLZ', description: 'Belize' },
  { countryCode: 'BEN', description: 'Benin' },
  { countryCode: 'BMU', description: 'Bermuda' },
  { countryCode: 'BTN', description: 'Bhutan' },
  { countryCode: 'BOL', description: 'Bolivia, Plurinational State of' },
  { countryCode: 'BES', description: 'Bonaire, Sint Eustatius and Saba' },
  { countryCode: 'BIH', description: 'Bosnia and Herzegovina' },
  { countryCode: 'BWA', description: 'Botswana' },
  { countryCode: 'BVT', description: 'Bouvet Island' },
  { countryCode: 'BRA', description: 'Brazil' },
  { countryCode: 'IOT', description: 'British Indian Ocean Territory' },
  { countryCode: 'BRN', description: 'Brunei Darussalam' },
  { countryCode: 'BGR', description: 'Bulgaria' },
  { countryCode: 'BFA', description: 'Burkina Faso' },
  { countryCode: 'BDI', description: 'Burundi' },
  { countryCode: 'KHM', description: 'Cambodia' },
  { countryCode: 'CMR', description: 'Cameroon' },
  { countryCode: 'CAN', description: 'Canada' },
  { countryCode: 'CPV', description: 'Cape Verde' },
  { countryCode: 'CYM', description: 'Cayman Islands' },
  { countryCode: 'CAF', description: 'Central African Republic' },
  { countryCode: 'TCD', description: 'Chad' },
  { countryCode: 'CHL', description: 'Chile' },
  { countryCode: 'CHN', description: 'China' },
  { countryCode: 'CXR', description: 'Christmas Island' },
  { countryCode: 'CCK', description: 'Cocos (Keeling) Islands' },
  { countryCode: 'COL', description: 'Colombia' },
  { countryCode: 'COM', description: 'Comoros' },
  { countryCode: 'COG', description: 'Congo' },
  { countryCode: 'COD', description: 'Congo, the Democratic Republic of the' },
  { countryCode: 'COK', description: 'Cook Islands' },
  { countryCode: 'CRI', description: 'Costa Rica' },
  { countryCode: 'CIV', description: 'Côte d\'Ivoire' },
  { countryCode: 'HRV', description: 'Croatia' },
  { countryCode: 'CUB', description: 'Cuba' },
  { countryCode: 'CUW', description: 'Curaçao' },
  { countryCode: 'CYP', description: 'Cyprus' },
  { countryCode: 'CZE', description: 'Czech Republic' },
  { countryCode: 'DNK', description: 'Denmark' },
  { countryCode: 'DJI', description: 'Djibouti' },
  { countryCode: 'DMA', description: 'Dominica' },
  { countryCode: 'DOM', description: 'Dominican Republic' },
  { countryCode: 'ECU', description: 'Ecuador' },
  { countryCode: 'EGY', description: 'Egypt' },
  { countryCode: 'SLV', description: 'El Salvador' },
  { countryCode: 'GNQ', description: 'Equatorial Guinea' },
  { countryCode: 'ERI', description: 'Eritrea' },
  { countryCode: 'EST', description: 'Estonia' },
  { countryCode: 'ETH', description: 'Ethiopia' },
  { countryCode: 'FLK', description: 'Falkland Islands (Malvinas)' },
  { countryCode: 'FRO', description: 'Faroe Islands' },
  { countryCode: 'FJI', description: 'Fiji' },
  { countryCode: 'FIN', description: 'Finland' },
  { countryCode: 'FRA', description: 'France' },
  { countryCode: 'GUF', description: 'French Guiana' },
  { countryCode: 'PYF', description: 'French Polynesia' },
  { countryCode: 'ATF', description: 'French Southern Territories' },
  { countryCode: 'GAB', description: 'Gabon' },
  { countryCode: 'GMB', description: 'Gambia' },
  { countryCode: 'GEO', description: 'Georgia' },
  { countryCode: 'DEU', description: 'Germany' },
  { countryCode: 'GHA', description: 'Ghana' },
  { countryCode: 'GIB', description: 'Gibraltar' },
  { countryCode: 'GRC', description: 'Greece' },
  { countryCode: 'GRL', description: 'Greenland' },
  { countryCode: 'GRD', description: 'Grenada' },
  { countryCode: 'GLP', description: 'Guadeloupe' },
  { countryCode: 'GUM', description: 'Guam' },
  { countryCode: 'GTM', description: 'Guatemala' },
  { countryCode: 'GGY', description: 'Guernsey' },
  { countryCode: 'GIN', description: 'Guinea' },
  { countryCode: 'GNB', description: 'Guinea-Bissau' },
  { countryCode: 'GUY', description: 'Guyana' },
  { countryCode: 'HTI', description: 'Haiti' },
  { countryCode: 'HMD', description: 'Heard Island and McDonald Islands' },
  { countryCode: 'VAT', description: 'Holy See (Vatican City State)' },
  { countryCode: 'HND', description: 'Honduras' },
  { countryCode: 'HKG', description: 'Hong Kong' },
  { countryCode: 'HUN', description: 'Hungary' },
  { countryCode: 'ISL', description: 'Iceland' },
  { countryCode: 'IND', description: 'India' },
  { countryCode: 'IDN', description: 'Indonesia' },
  { countryCode: 'IRN', description: 'Iran, Islamic Republic of' },
  { countryCode: 'IRQ', description: 'Iraq' },
  { countryCode: 'IRL', description: 'Ireland' },
  { countryCode: 'IMN', description: 'Isle of Man' },
  { countryCode: 'ISR', description: 'Israel' },
  { countryCode: 'ITA', description: 'Italy' },
  { countryCode: 'JAM', description: 'Jamaica' },
  { countryCode: 'JPN', description: 'Japan' },
  { countryCode: 'JEY', description: 'Jersey' },
  { countryCode: 'JOR', description: 'Jordan' },
  { countryCode: 'KAZ', description: 'Kazakhstan' },
  { countryCode: 'KEN', description: 'Kenya' },
  { countryCode: 'KIR', description: 'Kiribati' },
  { countryCode: 'PRK', description: 'Korea, Democratic People\'s Republic of' },
  { countryCode: 'KOR', description: 'Korea, Republic of' },
  { countryCode: 'KWT', description: 'Kuwait' },
  { countryCode: 'KGZ', description: 'Kyrgyzstan' },
  { countryCode: 'LAO', description: 'Lao People\'s Democratic Republic' },
  { countryCode: 'LVA', description: 'Latvia' },
  { countryCode: 'LBN', description: 'Lebanon' },
  { countryCode: 'LSO', description: 'Lesotho' },
  { countryCode: 'LBR', description: 'Liberia' },
  { countryCode: 'LBY', description: 'Libya' },
  { countryCode: 'LIE', description: 'Liechtenstein' },
  { countryCode: 'LTU', description: 'Lithuania' },
  { countryCode: 'LUX', description: 'Luxembourg' },
  { countryCode: 'MAC', description: 'Macao' },
  { countryCode: 'MKD', description: 'Macedonia, the former Yugoslav Republic of' },
  { countryCode: 'MDG', description: 'Madagascar' },
  { countryCode: 'MWI', description: 'Malawi' },
  { countryCode: 'MYS', description: 'Malaysia' },
  { countryCode: 'MDV', description: 'Maldives' },
  { countryCode: 'MLI', description: 'Mali' },
  { countryCode: 'MLT', description: 'Malta' },
  { countryCode: 'MHL', description: 'Marshall Islands' },
  { countryCode: 'MTQ', description: 'Martinique' },
  { countryCode: 'MRT', description: 'Mauritania' },
  { countryCode: 'MUS', description: 'Mauritius' },
  { countryCode: 'MYT', description: 'Mayotte' },
  { countryCode: 'MEX', description: 'Mexico' },
  { countryCode: 'FSM', description: 'Micronesia, Federated States of' },
  { countryCode: 'MDA', description: 'Moldova, Republic of' },
  { countryCode: 'MCO', description: 'Monaco' },
  { countryCode: 'MNG', description: 'Mongolia' },
  { countryCode: 'MNE', description: 'Montenegro' },
  { countryCode: 'MSR', description: 'Montserrat' },
  { countryCode: 'MAR', description: 'Morocco' },
  { countryCode: 'MOZ', description: 'Mozambique' },
  { countryCode: 'MMR', description: 'Myanmar' },
  { countryCode: 'NAM', description: 'Namibia' },
  { countryCode: 'NRU', description: 'Nauru' },
  { countryCode: 'NPL', description: 'Nepal' },
  { countryCode: 'NLD', description: 'Netherlands' },
  { countryCode: 'NCL', description: 'New Caledonia' },
  { countryCode: 'NZL', description: 'New Zealand' },
  { countryCode: 'NIC', description: 'Nicaragua' },
  { countryCode: 'NER', description: 'Niger' },
  { countryCode: 'NGA', description: 'Nigeria' },
  { countryCode: 'NIU', description: 'Niue' },
  { countryCode: 'NFK', description: 'Norfolk Island' },
  { countryCode: 'MNP', description: 'Northern Mariana Islands' },
  { countryCode: 'NOR', description: 'Norway' },
  { countryCode: 'OMN', description: 'Oman' },
  { countryCode: 'PAK', description: 'Pakistan' },
  { countryCode: 'PLW', description: 'Palau' },
  { countryCode: 'PSE', description: 'Palestinian Territory, Occupied' },
  { countryCode: 'PAN', description: 'Panama' },
  { countryCode: 'PNG', description: 'Papua New Guinea' },
  { countryCode: 'PRY', description: 'Paraguay' },
  { countryCode: 'PER', description: 'Peru' },
  { countryCode: 'PHL', description: 'Philippines' },
  { countryCode: 'PCN', description: 'Pitcairn' },
  { countryCode: 'POL', description: 'Poland' },
  { countryCode: 'PRT', description: 'Portugal' },
  { countryCode: 'PRI', description: 'Puerto Rico' },
  { countryCode: 'QAT', description: 'Qatar' },
  { countryCode: 'REU', description: 'Réunion' },
  { countryCode: 'ROU', description: 'Romania' },
  { countryCode: 'RUS', description: 'Russian Federation' },
  { countryCode: 'RWA', description: 'Rwanda' },
  { countryCode: 'BLM', description: 'Saint Barthélemy' },
  { countryCode: 'SHN', description: 'Saint Helena, Ascension and Tristan da Cunha' },
  { countryCode: 'KNA', description: 'Saint Kitts and Nevis' },
  { countryCode: 'LCA', description: 'Saint Lucia' },
  { countryCode: 'MAF', description: 'Saint Martin (French part)' },
  { countryCode: 'SPM', description: 'Saint Pierre and Miquelon' },
  { countryCode: 'VCT', description: 'Saint Vincent and the Grenadines' },
  { countryCode: 'WSM', description: 'Samoa' },
  { countryCode: 'SMR', description: 'San Marino' },
  { countryCode: 'STP', description: 'Sao Tome and Principe' },
  { countryCode: 'SAU', description: 'Saudi Arabia' },
  { countryCode: 'SEN', description: 'Senegal' },
  { countryCode: 'SRB', description: 'Serbia' },
  { countryCode: 'SYC', description: 'Seychelles' },
  { countryCode: 'SLE', description: 'Sierra Leone' },
  { countryCode: 'SGP', description: 'Singapore' },
  { countryCode: 'SXM', description: 'Sint Maarten (Dutch part)' },
  { countryCode: 'SVK', description: 'Slovakia' },
  { countryCode: 'SVN', description: 'Slovenia' },
  { countryCode: 'SLB', description: 'Solomon Islands' },
  { countryCode: 'SOM', description: 'Somalia' },
  { countryCode: 'ZAF', description: 'South Africa' },
  { countryCode: 'SGS', description: 'South Georgia and the South Sandwich Islands' },
  { countryCode: 'SSD', description: 'South Sudan' },
  { countryCode: 'ESP', description: 'Spain' },
  { countryCode: 'LKA', description: 'Sri Lanka' },
  { countryCode: 'SDN', description: 'Sudan' },
  { countryCode: 'SUR', description: 'Suriname' },
  { countryCode: 'SJM', description: 'Svalbard and Jan Mayen' },
  { countryCode: 'SWZ', description: 'Swaziland' },
  { countryCode: 'SWE', description: 'Sweden' },
  { countryCode: 'CHE', description: 'Switzerland' },
  { countryCode: 'SYR', description: 'Syrian Arab Republic' },
  { countryCode: 'TWN', description: 'Taiwan, Province of China' },
  { countryCode: 'TJK', description: 'Tajikistan' },
  { countryCode: 'TZA', description: 'Tanzania, United Republic of' },
  { countryCode: 'THA', description: 'Thailand' },
  { countryCode: 'TLS', description: 'Timor-Leste' },
  { countryCode: 'TGO', description: 'Togo' },
  { countryCode: 'TKL', description: 'Tokelau' },
  { countryCode: 'TON', description: 'Tonga' },
  { countryCode: 'TTO', description: 'Trinidad and Tobago' },
  { countryCode: 'TUN', description: 'Tunisia' },
  { countryCode: 'TUR', description: 'Turkey' },
  { countryCode: 'TKM', description: 'Turkmenistan' },
  { countryCode: 'TCA', description: 'Turks and Caicos Islands' },
  { countryCode: 'TUV', description: 'Tuvalu' },
  { countryCode: 'UGA', description: 'Uganda' },
  { countryCode: 'UKR', description: 'Ukraine' },
  { countryCode: 'ARE', description: 'United Arab Emirates' },
  { countryCode: 'GBR', description: 'United Kingdom' },
  { countryCode: 'USA', description: 'United States' },
  { countryCode: 'UMI', description: 'United States Minor Outlying Islands' },
  { countryCode: 'URY', description: 'Uruguay' },
  { countryCode: 'UZB', description: 'Uzbekistan' },
  { countryCode: 'VUT', description: 'Vanuatu' },
  { countryCode: 'VEN', description: 'Venezuela, Bolivarian Republic of' },
  { countryCode: 'VNM', description: 'Viet Nam' },
  { countryCode: 'VGB', description: 'Virgin Islands, British' },
  { countryCode: 'VIR', description: 'Virgin Islands, U.S.' },
  { countryCode: 'WLF', description: 'Wallis and Futuna' },
  { countryCode: 'ESH', description: 'Western Sahara' },
  { countryCode: 'YEM', description: 'Yemen' },
  { countryCode: 'ZMB', description: 'Zambia' },
  { countryCode: 'ZWE', description: 'Zimbabwe' }
];

export function getCountryDescription( countryCode: string ) {
  const countryObj = COUNTRY_LIST.find( val => countryCode === val.countryCode );
  return countryObj ? countryObj.description : countryCode;
}

@Component({
  selector: 'common-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent extends Base implements ControlValueAccessor {

  @Input() label: string = 'Country';
  @Input() countryList: CountryList[] = COUNTRY_LIST;
  @Input() labelforId: string = 'country_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() useDropDownList: boolean = true;
  @Input() maxlen: string = '250';

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.country = val;
    }
  }
  get value() {
    return this.country;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();

  country: string = '';

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  onValueChange( value: any ) {
    if ( value !== this.country ) {
      this._onChange( value );
      this.valueChange.emit( value );
      this.country = value;
    }
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value ) {
      this.country = value;
    }
  }

  // Register change function
  registerOnChange( fn: any ): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched( fn: any ): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
