import { Component, Input, Output, EventEmitter, Optional, Self, OnInit } from '@angular/core';
import { Base } from '../../models/base';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { GeoAddressResult, GeocoderService } from '../../../services/src/geocoder.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';

@Component({
  selector: 'common-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.scss']
})
export class StreetComponent extends Base implements OnInit, ControlValueAccessor  {

  @Input() label: string = 'Full street address or rural route';
  @Input() maxlen: string = '1000';
  @Input() labelforId: string = 'street_' + this.objectId;
  @Input() disabled: boolean = false;
  @Input() useGeoCoder: boolean = false;

  @Input()
  set value( val: string ) {
    if ( val ) {
      this.street = val;
    }
  }
  get value() {
    return this.street;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectEvent: EventEmitter<GeoAddressResult> = new EventEmitter<GeoAddressResult>();

  street: string = '';

  /**
   * The list of results, from API, that is passed to the typeahead list
   * Result from GeoCoderService address lookup
   */
  typeaheadList$: Observable<GeoAddressResult[]>;

  /** Search string to store result from GeoCoder request */
  private search: string;
  /** The subject that triggers on user text input and gets typeaheadList$ to update.  */
  private searchText$ = new Subject<string>();

  _onChange = (_: any) => {};
  _onTouched = (_: any) => {};

  constructor( @Optional() @Self() public controlDir: NgControl,
               private geocoderService: GeocoderService ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
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

  onValueChange( value: any ) {
    if ( this.useGeoCoder ) {
      // set the search string
      this.search = value;
    }
    this._onChange( value );
    this.valueChange.emit( value );
  }

  onBlurEvent( event: any ) {
    this._onTouched( event );
    this.blurEvent.emit( event );
  }

  writeValue( value: any ): void {
    if ( value ) {
        this.street = value;
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

  onSelect(event: TypeaheadMatch): void {
    console.log( 'onSelect: ', event.item );
    this.street = event.item.street;
    this.selectEvent.emit( event.item );
  }
}
