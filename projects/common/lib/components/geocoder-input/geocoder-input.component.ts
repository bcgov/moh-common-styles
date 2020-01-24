import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges, OnChanges, Optional, Self } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Base } from '../../models/base';
import { GeocoderService, GeoAddressResult } from '../../services/geocoder.service';
import { CANADA } from '../country/country.component';
import { BRITISH_COLUMBIA } from '../province/province.component';
import { Address } from '../../models/address.model';
import { NgControl, ControlValueAccessor } from '@angular/forms';


/**
 * For TemplateForms, pass in an Address and recieve an Address
 * @example
 *           <common-geocoder-input
 *               label='Physical Address'
 *               [(ngModel)]="myAddress">
 *           </common-geocoder-input>
 *
 * @note
 * For ReactiveForms, pass in a string and recieve a string.  If you need the
 * Address object you can use (addressChange) in addition.
 *
 * @example
 *           <common-geocoder-input
 *              label='Physical Address'
 *              formControlName="address"
 *              (addressChange)="getAddressObject($event)">
 *          </common-geocoder-input>
 */
@Component({
  selector: 'common-geocoder-input',
  templateUrl: './geocoder-input.component.html',
  styleUrls: ['./geocoder-input.component.scss']
})
export class GeocoderInputComponent extends Base implements OnInit, OnChanges, ControlValueAccessor {

  @Input() label: string = 'Address Lookup';
  @Input() address: Address = new Address();
  @Output() addressChange = new EventEmitter<Address>();
  @Input() maxlength: string = '255';

  /** The string in the box the user has typed */
  public search: string;
  /** Is the Geocoder API request still in progress? */
  public isTypeaheadLoading: boolean = false;
  /** Geocoder API has returned and has no results, an empty array. */
  public hasNoResults: boolean = false;
  public hasError: boolean = false;

  /** Similar to this.address, but we can null it when user is searching for new addresses */
  public selectedAddress: Address;
  /** The list of results, from API, that is passed to the typeahead list */
  public typeaheadList$: Observable<GeoAddressResult[]>; // Result from GeoCoderService address lookup
  /** The subject that triggers on user text input and gets typeaheadList$ to update.  */
  private searchText$ = new Subject<string>();

  _onChange = (_: any) => {};
  _onTouched = (_?: any) => {};

  constructor(@Optional() @Self() public controlDir: NgControl, private geocoderService: GeocoderService, private cd: ChangeDetectorRef) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.typeaheadList$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // Trigger the network request, get results
      switchMap(searchPhrase => this.geocoderService.lookup(searchPhrase)),
      catchError(err => this.onError(err))
    );

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes &&
      changes.address &&
      changes.address.currentValue._geocoderFullAddress) {
        const stripped = this.stripStringToMaxLength(changes.address.currentValue._geocoderFullAddress);

        this.search = stripped;
        this.isTypeaheadLoading = false;
        this.hasNoResults = false;
        this.selectedAddress = changes.address.currentValue;
      }

  }

  onError(err): Observable<GeoAddressResult[]> {
    this.hasError = true;
    // Empty array simulates no result response, nothing for typeahead to iterate over
    return of([]);
  }

  onLoading(val: boolean): void {
    this.isTypeaheadLoading = val;
  }

  // Note - this will fire after an onError as well
  onNoResults(val: boolean): void {

    //  No results return what was typed into the search string
    this._onChange(this.search);
    // Build Address string with only street
    const addr = new Address();
    addr.street = this.search;
    // Emit Address object with street only
    this.addressChange.emit(addr);


    // If we have results, the error has resolved (e.g. network has re-connected)
    if (val === false) {
      this.hasError = false;
    }

    // If we have no search text, hide the no results errors
    if (this.search.length === 0) {
      this.hasNoResults = false;
      return;
    }

    this.hasNoResults = val;
  }

  onSelect(event: TypeaheadMatch): void {
    const data: GeoAddressResult = event.item;

    const addr = new Address();
    addr.city = data.city;
    // GeoCoder is only for BC, Canada, values can be set.
    addr.country = CANADA; // Default country is Canda
    addr.province = BRITISH_COLUMBIA;  // Default province is BC
    addr.street = data.street;
    // Save and emit Address for (addressChange)
    this.selectedAddress = addr;
    this.addressChange.emit(this.selectedAddress);

    // Output string to FormControl.
    const stripped = this.stripStringToMaxLength(data.fullAddress);
    this._onChange(stripped);
  }

  onKeyUp(event: KeyboardEvent): void {
    // Filter out 'enter' and other similar keyboard events that can trigger
    // when user is selecting a typeahead option instead of entering new text.
    // Without this filter, we do another HTTP request + force disiplay the UI
    // for now reason
    if (event.keyCode === 13 || event.keyCode === 9) {  // enter & tab
      return;
    }
    // Clear out selection
    this.selectedAddress = null;
    this.searchText$.next(this.search);
  }

  onBlur(event): void {
    this._onTouched();
    this._onChange(this.search);
  }


  writeValue( value: any ): void {
    if ( value ) {
      this.search = value;
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

  private stripStringToMaxLength(str: string) {
    const maxlength = parseInt(this.maxlength, 10);
    return str.slice(0, maxlength);
  }

}
