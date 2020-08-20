import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges, OnChanges, Optional, Self } from '@angular/core';
import { Subject, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Base } from '../../models/base';
import { Address } from '../../models/address.model';



/**
 * For TemplateForms, pass in an Address and recieve an Address
 * @example
 *           <common-address-validator
 *               label='Physical Address'
 *               [(ngModel)]="myAddress">
 *           </common-address-validator>
 *
 * @note
 * For ReactiveForms, pass in a string and recieve a string.  If you need the
 * Address object you can use (select) in addition.
 *
 * @example
 *           <common-address-validator
 *              label='Physical Address'
 *              formControlName="address"
 *              (select)="getAddressObject($event)">
 *          </common-address-validator>
 */

export interface AddressResult {
  /** String from the API that includes street, city, province, and country. */
  AddressComplete: string;
  Locality: string;
  DeliveryAddressLines: string;
  // Set to defaults in response
  Country: string;
  Province: string;
  PostalCode: string;
}

@Component({
  selector: 'common-address-validator',
  templateUrl: './address-validator.component.html',
  styleUrls: ['./address-validator.component.scss']
})
export class AddressValidatorComponent extends Base implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Address Lookup';
  @Input() address: string;
  @Input() serviceUrl: string;
  @Output() addressChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() select: EventEmitter<Address> = new EventEmitter<Address>();

  @Input() maxlength: string = '255';

  /** The string in the box the user has typed */
  public search: string;
  /** Is the request still in progress? */
  public isTypeaheadLoading: boolean = false;
  /** has returned and has no results, an empty array. */
  public hasNoResults: boolean = false;
  public hasError: boolean = false;

  /** Similar to this.address, but we can null it when user is searching for new addresses */
  public selectedAddress: boolean = false;
  /** The list of results, from API, that is passed to the typeahead list */
  public typeaheadList$: Observable<AddressResult[]>; // Result from address lookup
  /** The subject that triggers on user text input and gets typeaheadList$ to update.  */
  private searchText$ = new Subject<string>();

  _onChange = (_: any) => {};
  _onTouched = (_?: any) => {};

  constructor(@Optional() @Self() public controlDir: NgControl,
              private cd: ChangeDetectorRef,
              protected http: HttpClient) {
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
      switchMap(searchPhrase => this.lookup(searchPhrase)),
      catchError(err => this.onError(err))
    );
  }

  onError(err): Observable<AddressResult[]> {
    this.hasError = true;
    // Empty array simulates no result response, nothing for typeahead to iterate over
    return of([]);
  }

  onLoading(val: boolean): void {
    // console.log( 'onLoading - address-validator' , val );
    this.isTypeaheadLoading = val;
    this.hasError = false;
  }

  // Note - this will fire after an onError as well
  onNoResults(val: boolean): void {

   //  console.log( 'No results - AddressValidator' , val );

    // If we have results, the error has resolved (e.g. network has re-connected)
    if (val === false) {
      this.hasError = false;
    }

    this.hasNoResults = val;
  }

  onSelect(event: TypeaheadMatch): void {

    // console.log( 'onSelect: ', event );
    const data: AddressResult = event.item;

    // Output string to FormControl. If street is more than the max length shorten
    const stripped = this.stripStringToMaxLength(data.DeliveryAddressLines);

    const addr = new Address();
    addr.city = data.Locality;
    addr.country = data.Country;
    addr.province = data.Province;
    addr.street = stripped;
    addr.postal = data.PostalCode;
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

  lookup(address: string): Observable<AddressResult[]> {
    const params = new HttpParams()
                    .set('address', address);

    return this.http.get(this.serviceUrl, {
      params: params
    }).pipe(map(this.processResponse));
  }

  /**
   * Formats the response from ADDRESS_URL, trimming irrelevant fields.
   *
   * This works for other requests for the same API too, however it may error
   * out on some items if matchPrecisionNot is not set.
   *
   * @param obj The response from ADDRESS_URL
   */
  protected processResponse(obj): AddressResult[] {
    return obj.Address.map(feature => {
      const props = feature;
      const Locality = props.Locality;
      const AddressComplete = props.AddressComplete;
      const DeliveryAddressLines = props.DeliveryAddressLines;
      const Province = props.Province;
      const Country = props.Country;
      const PostalCode = props.PostalCode;

      return {
        AddressComplete,
        Locality,
        DeliveryAddressLines,
        Province,
        Country,
        PostalCode
      };
    });
  }

  protected handleError(error: HttpErrorResponse) {
    console.error('AddressValidator network error', { error });
    return throwError('AddressValidator error');
  }

}
