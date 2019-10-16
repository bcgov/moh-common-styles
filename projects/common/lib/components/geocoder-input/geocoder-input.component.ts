import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Base } from '../../models/base';
import { GeocoderService, GeoAddressResult } from '../../services/geocoder.service';
import { CANADA } from '../country/country.component';
import { BRITISH_COLUMBIA } from '../province/province.component';
import { Address } from '../../models/address.model';

@Component({
  selector: 'common-geocoder-input',
  templateUrl: './geocoder-input.component.html',
  styleUrls: ['./geocoder-input.component.scss']
})
export class GeocoderInputComponent extends Base implements OnInit, OnChanges {

  @Input() label: string = 'Address Lookup';
  @Input() address: Address = new Address();
  @Output() addressChange = new EventEmitter<Address>();

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

  constructor(private geocoderService: GeocoderService, private cd: ChangeDetectorRef) {
    super();
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
    if (changes.address.currentValue._geocoderFullAddress) {
      this.search = changes.address.currentValue._geocoderFullAddress;
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

    // addr._geocoderFullAddress = data.fullAddress;

    // Save and emit Address
    this.selectedAddress = addr;

    // console.log( 'OnSelect (geoCoder): ', this.selectedAddress );
    this.addressChange.emit(this.selectedAddress);
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

}
