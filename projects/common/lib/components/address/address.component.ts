import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  forwardRef,
  OnInit
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Base } from '../../models/base';
import { GeoAddressResult } from '../../services/geocoder.service';
import { Address } from '../../models/address.model';
import { CountryList, CANADA, COUNTRY_LIST } from '../country/country.component';
import { ProvinceList, BRITISH_COLUMBIA, PROVINCE_LIST } from '../province/province.component';

export interface AddrLabelList {
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}

export interface Maxlengths {
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}

export interface ReadOnlyFields {
  address?: boolean;
  city?: boolean;
  province?: boolean;
  country?: boolean;
  postalCode?: boolean;
}

/**
 *
 * Note - This component REQUIRES that `HttpClientModule` is registered in your NgModule.
 */
@Component({
  selector: 'common-address',
  templateUrl: './address.component.html',
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressComponent) }
  ]
})
export class AddressComponent extends Base
  implements OnInit, OnChanges, ControlValueAccessor {

  /* Disable all fields by sending in boolean,
   * disable specific fields by sending in ReadOnlyFields structure
   */
  @Input() disabled: boolean | ReadOnlyFields = false;
  @Input() isRequired: boolean = false;
  @Input() countryList: CountryList[] = COUNTRY_LIST;
  @Input() defaultCountry: string = CANADA;
  @Input() provinceList: ProvinceList[] = PROVINCE_LIST;
  @Input() defaultProvince: string = BRITISH_COLUMBIA;
  @Input() disableGeocoder: boolean = false; // This should eventually be refactored to `disableAddressValidator`. Leaving it for compatibility.
  @Input() labels: AddrLabelList;
  @Input() maxlengths: Maxlengths;
  @Input() bcOnly: boolean = false;
  @Input() addressServiceUrl: string;

  @Input()
  set address(val: Address) {
    if (val) {
      this.addr = val;
    }
  }
  get address(): Address {
    return this.addr;
  }

  @Output() addressChange: EventEmitter<Address> = new EventEmitter<Address>();
  /**
   * If true, adds a plus icon next to street and enables users to add a second
   * address line.  This value binds to `address.addressLine2`
   */
  @Input() allowExtralines: boolean = false;

  addr: Address;
  provList: ProvinceList[];
  showLine2 = false;
  showLine3 = false;

  // Labels defaulted to MSP
  addrLabels: AddrLabelList =  {
    address1: 'Full street address, rural route, PO box or general delivery',
    address2: 'Address Line 2',
    address3: 'Address Line 3',
    city: 'City',
    province: 'Province or state',
    country: 'Country',
    postalCode: 'Postal Code or Zip Code'
  };

  // Lengths defaulted to MSP
  fieldMaxLengths: Maxlengths = {
    address: '25',
    city: '25',
    province: '25',
    country: '250',
    postalCode: '25'
  };

  readOnlyFields: ReadOnlyFields = {
    address: false,
    city: false,
    province: false,
    country: false,
    postalCode: false,
  };

  _onChange = (_: any) => { };
  _onTouched = (_: any) => { };

  constructor() {
    super();
  }

  ngOnInit() {
    this.setLabels();
    this.setMaxlengths();
    this.setReadOnlyFields();

    if (this.addr) {

      if (!this.addr.country) {
        this.addr.country = this.setDefaultCountryAsOption();
      } else {
        // If string for country submitted, need to find code to display value in select box
        this.addr.country = this.findCountryCode( this.addr.country );
      }

      if (!this.addr.province) {
        this.addr.province = this.setDefaultProvinceAsOption(this.addr.country);
      }

      // Make sure addressLine2 is visible if there is data persisted to display there.
      if (this.allowExtralines) {
        if (this.addr.addressLine2) {
          this.addLine(2);
        }

        if (this.addr.addressLine3) {
          this.addLine(3);
        }
      }
    }

    this.updateProvList();
  }

  /**
   * Set country province blank
   * @param value
   */
  setCountry(value: string) {
    this.addr.province = this.setDefaultProvinceAsOption( value );
    this.addr.country = value;
    this.updateProvList();

   if ( this.isCanada() ) {
      // If Canada, clear postal code to display mask
      this.addr.postal = '';

      if (!this.disableGeocoder) {
        this.showLine2 = false;
        this.showLine3 = false;
        this.addr.addressLine2 = '';
        this.addr.addressLine3 = '';
      }
    }

    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  setProvince(value: string) {
    this.addr.province = value;
    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  setStreetAddress(value: string) {
    this.addr.addressLine1 = value;
    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  setCity(value: string) {
    this.addr.city = value;
    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  /**
   * Sets string after converted upper case
   * @param text
   */
  setPostalCode(value: string) {
    this.addr.postal = value;
    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  isCanada(): boolean {
    return this.addr && CANADA === this.addr.country;
  }

  ngOnChanges(changes) {
    if (changes['countryList'] && changes['countryList'].currentValue) {

      if (this.addr && !this.addr.country) {
        // Set defaults
        this.addr.country = this.setDefaultCountryAsOption();

        // Set defaults
        this.addr.province = this.setDefaultProvinceAsOption(this.addr.country);
      }
      this.updateProvList();
    }
    if (changes['provinceList'] && changes['provinceList'].currentValue) {
      if (this.addr && !this.addr.province) {
        // Set defaults
        this.addr.province = this.setDefaultProvinceAsOption(this.addr.country);
      }
      this.updateProvList();
    }
  }

  addLine(line: 2 | 3 = null) {

    // Add lines in order
    if (line === null) {
      if (!this.showLine2) {
        this.showLine2 = true;
      } else if (!this.showLine3) {
        this.showLine3 = true;
      }
    } else {
      // Add specific line number
      const lookup = `showLine${line}`;
      this[lookup] = true;
    }
  }

  removeLine(line: 2 | 3) {
    // We can remove lines in any order, depending on user input
    // Dynamically lookup variable based on line number input.
    const lookup = `showLine${line}`;
    this[lookup] = false;

    // TODO - Need to clear the data in the appropriate field, just null/undefined it out.
    const addrLookup = `addressLine${line}`;
    this.address[addrLookup] = undefined;
  }

  /**
   * Updates the provList variable. Values must be stored in a variable and not
   * accessed via function invocation for performance.
   */
  private updateProvList() {
    if (!this.provinceList) { return; } // When data is async and hasn't loaded
    this.provList = this.provinceList
      .map(prov => {
        if (prov.country === this.addr.country) {
          return prov;
        }
      })
      .filter(x => x);
  }

  /**
   * Sets the default province option value
   */
  private setDefaultProvinceAsOption(country: string): string {
    const provObj = !this.provinceList ? null : this.provinceList.find(
      val => (val.provinceCode === this.defaultProvince ||
        val.description === this.defaultProvince) &&
        val.country === country
    );
    return (provObj ? provObj.provinceCode : '');
  }

  private findProvinceDescription(prov: string): string {
    const provObj = !this.provinceList ? null : this.provinceList.find(
      val => val.provinceCode === prov ||
        val.description === prov
    );
    return (provObj ? provObj.description : null);
  }

  /**
   * Set country to default
   * Search uses country code or country name to find item is list.
   */
  private setDefaultCountryAsOption(): string {
    return this.findCountryCode( this.defaultCountry );
  }

  private findCountryCode( country: string ): string {
    const countryObj = !this.countryList
      ? null
      : this.countryList.find(
        val =>
          val.countryCode === country ||
          val.description === country
      );
    return countryObj ? countryObj.countryCode : null;
  }

  get useAddressValidator(): boolean {
    if (this.disableGeocoder) {
      return false;
    }
    return this.isCanada();
  }

  // Only BC addresses therefore no need to copy province into structure.
  setAddress(data: GeoAddressResult) {
    this.addr.addressLine1 = data.street;
    this.addr.city = data.city;
    this.addr.province = data.province;
    this.addr.country = data.country;
    this.addressChange.emit(this.addr);
  }

  selectSuggestedAddress(address: Address) {
    if (!address.street && !address.city && !address.postal) {
      return;
    }
    if (this.bcOnly && address.province != BRITISH_COLUMBIA) {
      alert('Please select a valid BC address.');
      return;
    }
    this.addr.addressLine1 = address.street;
    this.addr.city = address.city;
    this.addr.postal = address.postal;
    if (!this.bcOnly) {
      this.addr.province = address.province;
    }
    this._onChange(this.addr);
    this.addressChange.emit(this.addr);
    this._onTouched(this.addr);
  }

  writeValue( value: Address) {
    if ( value ) {
      this.addr = value;
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.setReadOnlyFields();
  }

  private setLabels() {
    if ( this.labels ) {
      Object.keys(this.labels).map( x => this.addrLabels[x] = this.labels[x] );
    }
  }

  private setMaxlengths() {
    if ( this.maxlengths ) {
      Object.keys(this.fieldMaxLengths).map( x => this.maxlengths[x] = this.fieldMaxLengths[x]);
    }
  }

  private setReadOnlyFields() {
    if ( typeof this.disabled === 'boolean' ) {
      Object.keys(this.readOnlyFields).map( x => this.readOnlyFields[x] = this.disabled );
    } else {
      Object.keys(this.disabled).map( x => this.readOnlyFields[x] = this.disabled[x] );
    }
  }
}
