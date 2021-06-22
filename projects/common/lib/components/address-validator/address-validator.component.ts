import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, Optional, Self } from '@angular/core';
import { Subject, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Address } from '../../models/address.model';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
import { deburr } from '../../../helpers/deburr';



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
  HouseNumber: string;
  SubBuilding: string;
  Street: string;
  Locality: string;
  DeliveryAddressLines: string;
  AddressLines: Array<string>;
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
export class AddressValidatorComponent extends AbstractFormControl implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Address Lookup';
  @Input() address: string;
  @Input() serviceUrl: string;
  @Input() populateAddressOnSelect: boolean = false;
  @Output() addressChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() select: EventEmitter<Address> = new EventEmitter<Address>();

  @Input() maxlength: string = '255';

  _defaultErrMsg: ErrorMessage = {
    required:  LabelReplacementTag + ' is required.',
    invalidChar: LabelReplacementTag + ' must contain letters and numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.'
  };
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
  public typeaheadList$: Observable<AddressResult[]> = of([]); // Result from address lookup
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
    super.ngOnInit();
    
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
    this.isTypeaheadLoading = val;
    this.hasError = false;
  }

  // Note - this will fire after an onError as well
  onNoResults(val: boolean): void {
    // If we have results, the error has resolved (e.g. network has re-connected)
    if (val === false) {
      this.hasError = false;
    }

    this.hasNoResults = val;
  }

  onSelect(event: TypeaheadMatch): void {

    const data: AddressResult = event.item;

    // Output string to FormControl. If street is more than the max length shorten
    const stripped = data.AddressLines ? this.stripStringToMaxLength(deburr(data.AddressLines[0])) : null;

    const addr = new Address();
    addr.unitNumber = deburr(data.SubBuilding);
    addr.streetNumber = deburr(data.HouseNumber);
    addr.streetName = deburr(data.Street);
    addr.city = deburr(data.Locality);
    addr.country = data.Country;
    addr.province = data.Province;
    addr.street = stripped;
    addr.postal = deburr(data.PostalCode);
    addr.addressLine1 = data.AddressLines && data.AddressLines[0] ? deburr(data.AddressLines[0]) : null;
    addr.addressLine2 = data.AddressLines && data.AddressLines[1] ? deburr(data.AddressLines[1]) : null;
    addr.addressLine3 = data.AddressLines && data.AddressLines[2] ? deburr(data.AddressLines[2]) : null;
    // Save and emit Address for (select)
    this.selectedAddress = true;
    this.select.emit(addr);

    // For template forms, must explicitly set `search` value upon selecting an item.
    if (this.populateAddressOnSelect) {
      this.search = stripped;
    }
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
    if (this.search) {
      this._onChange(this.search);
    }
  }

  writeValue( value: any ): void {
    if ( value  !== undefined ) {
      this.search = value;
    }
  }

  setSearchValue(value: any) {
    this._onChange(value);
    this._onTouched(value);
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
      const AddressLines = props.AddressLines;
      const DeliveryAddressLines = props.DeliveryAddressLines;
      const Province = props.Province;
      const Country = props.Country;
      const PostalCode = props.PostalCode;
      const SubBuilding = props.SubBuilding;
      const Street = props.Street;
      const HouseNumber = props.HouseNumber;

      return {
        AddressComplete,
        AddressLines,
        SubBuilding,
        Street,
        HouseNumber,
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
