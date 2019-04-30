import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  OnChanges
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Address } from '../../../models/src/address.model';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Base } from '../../../models/src/base';
import { GeocoderService, GeoAddressResult } from '../../../services/src/geocoder.service';

/** Interface for countries */
export interface CountryList {
  countryCode: string;
  description: string;
}

export interface ProvinceList {
  country: string;
  provinceCode: string;
  description: string;
}

@Component({
  selector: 'common-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class AddressComponent extends Base implements OnInit, OnChanges {
    // Field lengths
    public CITY_MAXLEN = '100';
    public PROV_MAXLEN = '250';
    public STREET_RURAL_MAXLEN = '1000';


  // TODO: Create Unit tests for this component
  // Exists for unit testing to validate errors set
  @ViewChild('provRef') provRef: ElementRef;
  @ViewChild('streetRef') streetRef: ElementRef;
  @ViewChild('cityRef') cityRef: ElementRef;
  @ViewChild('postalRef') postalRef: ElementRef;

  @Input() disabled: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() address: Address = new Address();
  @Input() countryList: CountryList[];
  @Input() defaultCountry: string;
  @Input() provinceList: ProvinceList[];
  @Input() defaultProvince: string;

  @Output() addressChange: EventEmitter<Address> = new EventEmitter<Address>();

  /** Search string to store result from GeoCoder request */
  public search: string;
  /**
   * The list of results, from API, that is passed to the typeahead list
   * Result from GeoCoderService address lookup
   */
  public typeaheadList$: Observable<GeoAddressResult[]>;
  /** The subject that triggers on user text input and gets typeaheadList$ to update.  */
  private searchText$ = new Subject<string>();

  public provList: ProvinceList[];

  constructor(private geocoderService: GeocoderService) {
    super();
  }

  ngOnInit() {
    // Set up for using GeoCoder
    this.typeaheadList$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // Trigger the network request, get results
      switchMap(searchPhrase => {
        return this.geocoderService.lookup(searchPhrase);
      }),
      // tap(log => console.log('taplog', log)),
      catchError(err => this.onError(err))
    );
  }

  /**
   * Set country province blank
   * @param value
   */
  setCountry(value: string) {
    this.address.province = this.setDefaultProvinceAsOption(value);
    this.address.country = value;
    this.updateProvList();
    this.addressChange.emit(this.address);
  }

  setProvince(value: string) {
    this.address.province = value;
    this.addressChange.emit(this.address);
  }

  setStreetAddress(value: string) {
    this.address.street = value;
    this.addressChange.emit(this.address);
  }

  setCity(value: string) {
    this.address.city = value;
    this.addressChange.emit(this.address);
  }

  get postalCode() {
    return this.address.postal;
  }

  /**
   * Sets string after converted upper case
   * @param text
   */
  set postalCode(value: string) {
    this.address.postal = value.toUpperCase();
    this.addressChange.emit(this.address);
  }

  isCanada(): boolean {
    return this.address && 'CAN' === this.address.country;
  }

  isCanadaUSA(): boolean {
    return (this.address && 'USA' === this.address.country) || this.isCanada();
  }

  ngOnChanges(changes) {
    if (changes['countryList'] && changes['countryList'].currentValue) {

      if ( !this.address.country ) {
        // Set defaults
        this.address.country = this.setDefaultCountryAsOption();
      }
      // Set defaults
      this.address.province = this.setDefaultProvinceAsOption( this.address.country );

      this.updateProvList();
    }
    if (changes['provinceList'] && changes['provinceList'].currentValue) {
      if ( !this.address.province ) {
        // Set defaults
        this.address.province = this.setDefaultProvinceAsOption( this.address.country );
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
        if (prov.country === this.address.country) {
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
    return this.isCanada() && 'BC' === this.address.province;
  }

  onKeyUp(event: KeyboardEvent): void {
    /**
     * Filter out 'enter' and other similar keyboard events that can trigger
     * when user is selecting a typeahead option instead of entering new text.
     * Without this filter, we do another HTTP request + force disiplay the UI
     * for now reason
     */
    if (event.keyCode === 13 || event.keyCode === 9) {
      // enter & tab
      return;
    }

    this.searchText$.next(this.search);
  }

  onError(err: any): Observable<GeoAddressResult[]> {
    // Empty array simulates no result response, nothing for typeahead to iterate over
    return of([]);
  }

  // Only BC addresses therefore no need to copy province into structure.
  onSelect(event: TypeaheadMatch): void {
    const data: GeoAddressResult = event.item;

    this.search = data.street;
    this.address.street = data.street;
    this.address.city = data.city;
    this.address.province = 'BC';
    this.address.country = 'CAN';
    this.addressChange.emit(this.address);
  }
}
