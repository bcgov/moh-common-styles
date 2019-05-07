import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  forwardRef
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Base } from '../../../models/src/base';
import { GeoAddressResult } from '../../../services/src/geocoder.service';
import { Address } from '../../../models/src/address.model';
import { CountryList, CANADA, UNITED_STATES } from '../country/country.component';
import { ProvinceList, BRITISH_COLUMBIA } from '../province/province.component';


@Component({
  selector: 'common-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressComponent )}
  ]
})
export class AddressComponent extends Base
       implements OnChanges, ControlValueAccessor {

  @Input() disabled: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() countryList: CountryList[];
  @Input() defaultCountry: string;
  @Input() provinceList: ProvinceList[];
  @Input() defaultProvince: string;

  @Input()
  set address( val: Address ) {
    this.addr = val;
  }
  get address(): Address {
    return this.addr;
  }

  @Output() addressChange: EventEmitter<Address> = new EventEmitter<Address>();

  addr: Address;
  provList: ProvinceList[];

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor() {
    super();
  }

  /**
   * Set country province blank
   * @param value
   */
  setCountry(value: string) {
    this.addr.province = this.setDefaultProvinceAsOption(value);
    this.addr.country = value;
    this.updateProvList();
    this._onChange( this.addr );
    this.addressChange.emit( this.addr );
    this._onTouched( this.addr );
  }

  setProvince(value: string) {
    this.addr.province = value;
    this._onChange( this.addr );
    this.addressChange.emit(this.addr);
    this._onTouched( this.addr );
  }

  setStreetAddress(value: string) {
    this.addr.street = value;
    this._onChange( this.addr );
    this.addressChange.emit( this.addr );
    this._onTouched( this.addr );
  }

  setCity(value: string) {
    this.addr.city = value;
    this._onChange( this.addr );
    this.addressChange.emit( this.addr );
    this._onTouched( this.addr );
  }

  /**
   * Sets string after converted upper case
   * @param text
   */
  setPostalCode(value: string) {
    this.addr.postal = value;
    this._onChange( this.addr );
    this.addressChange.emit(this.addr);
    this._onTouched( this.addr );
  }

  isCanada(): boolean {
    return this.addr && CANADA === this.addr.country;
  }

  isCanadaUSA(): boolean {
    return (this.addr && UNITED_STATES === this.addr.country) || this.isCanada();
  }

  ngOnChanges(changes) {
    if (changes['countryList'] && changes['countryList'].currentValue) {

      if ( this.addr && !this.addr.country ) {
        // Set defaults
        this.addr.country = this.setDefaultCountryAsOption();

        // Set defaults
        this.addr.province = this.setDefaultProvinceAsOption( this.addr.country );
      }
      this.updateProvList();
    }
    if (changes['provinceList'] && changes['provinceList'].currentValue) {
      if ( this.addr && !this.addr.province ) {
        // Set defaults
        this.addr.province = this.setDefaultProvinceAsOption( this.addr.country );
      }
      this.updateProvList();
    }
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
  private setDefaultProvinceAsOption( country: string ): string {
    const provObj = !this.provinceList ? null : this.provinceList.find(
      val => (val.provinceCode === this.defaultProvince ||
             val.description === this.defaultProvince) &&
             val.country === country
    );
    return (provObj ? provObj.provinceCode : null );
  }

  /**
   * Set country to default
   * Search uses country code or country name to find item is list.
   */
  private setDefaultCountryAsOption(): string {
    const countryObj = !this.countryList
    ? null
    : this.countryList.find(
        val =>
          val.countryCode === this.defaultCountry ||
          val.description === this.defaultCountry
      );
    return countryObj ? countryObj.countryCode : null;
  }

  // GeoCoder

  /**
   * GeoCoder only is applicable when address is BC, Canada.
   */
  useGeoCoder(): boolean {
    return this.isCanada() && BRITISH_COLUMBIA === this.addr.province;
  }

  // Only BC addresses therefore no need to copy province into structure.
  setAddress(data: GeoAddressResult) {
    this.addr.street = data.street;
    this.addr.city = data.city;
    this.addr.province = data.province;
    this.addr.country = data.country;
    this.addressChange.emit( this.addr );
  }

  writeValue( value: Address) {
    console.log( 'address writeValue: ', value );
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
  }
}
