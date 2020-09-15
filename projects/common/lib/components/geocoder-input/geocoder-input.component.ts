import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges, OnChanges, Optional, Self } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Base } from '../../models/base';
import { GeocoderService, GeoAddressResult } from '../../services/geocoder.service';
import { CANADA } from '../country/country.component';
import { BRITISH_COLUMBIA } from '../province/province.component';
import { Address } from '../../models/address.model';
import { NgControl, ControlValueAccessor } from '@angular/forms';


/**
 * @deprecated Please use `address-validator` component instead.
 * 
 * For TemplateForms, pass in an Address and recieve an Address
 * @example
 *           <common-geocoder-input
 *               label='Physical Address'
 *               [(ngModel)]="myAddress">
 *           </common-geocoder-input>
 *
 * @note
 * For ReactiveForms, pass in a string and recieve a string.  If you need the
 * Address object you can use (select) in addition.
 *
 * @example
 *           <common-geocoder-input
 *              label='Physical Address'
 *              formControlName="address"
 *              (select)="getAddressObject($event)">
 *          </common-geocoder-input>
 */
@Component({
  selector: 'common-geocoder-input',
  templateUrl: './geocoder-input.component.html',
  styleUrls: ['./geocoder-input.component.scss']
})
export class GeocoderInputComponent extends Base implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Address Lookup';
  @Input() address: string;
  @Output() addressChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() select: EventEmitter<Address> = new EventEmitter<Address>();

  @Input() maxlength: string = '255';

  /** The string in the box the user has typed */
  public search: string;
  /** Is the Geocoder API request still in progress? */
  public isTypeaheadLoading: boolean = false;
  /** Geocoder API has returned and has no results, an empty array. */
  public hasNoResults: boolean = false;
  public hasError: boolean = false;

  /** Similar to this.address, but we can null it when user is searching for new addresses */
  public selectedAddress: boolean = false;
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

  onError(err): Observable<GeoAddressResult[]> {

    this.hasError = true;
    // Empty array simulates no result response, nothing for typeahead to iterate over
    return of([]);
  }

  onLoading(val: boolean): void {
    // console.log( 'onLoading - geocoder' , val );
    this.isTypeaheadLoading = val;
  }

  // Note - this will fire after an onError as well
  onNoResults(val: boolean): void {

   //  console.log( 'No results - geocoder' , val );

    // If we have results, the error has resolved (e.g. network has re-connected)
    if (val === false) {
      this.hasError = false;
    }

    this.hasNoResults = val;
  }

  onSelect(event: TypeaheadMatch): void {

    // console.log( 'onSelect: ', event );
    const data: GeoAddressResult = event.item;

    // Output string to FormControl. If street is more than the max length shorten
    const stripped = this.stripStringToMaxLength(data.street);

    const addr = new Address();
    addr.city = data.city;
    // GeoCoder is only for BC, Canada, values can be set.
    addr.country = CANADA; // Default country is Canda
    addr.province = BRITISH_COLUMBIA;  // Default province is BC
    addr.street = stripped;
    // Save and emit Address for (select)
    this.selectedAddress = true;
    this.select.emit(addr);

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
    this.selectedAddress = false;
    this.searchText$.next(this.search);
  }

  onBlur(event): void {
    this._onTouched();
    this._onChange(this.search);
  }


  writeValue( value: any ): void {
    if ( value  !== undefined ) {
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
