import { Component, Input, Output, EventEmitter, Optional, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { GeoAddressResult, GeocoderService } from '../../services/geocoder.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
import { CANADA } from '../country/country.component';
import { BRITISH_COLUMBIA } from '../province/province.component';

@Component({
  selector: 'common-street',
  templateUrl: './street.component.html',
})
export class StreetComponent extends AbstractFormControl implements OnInit  {

  @Input() label: string = 'Full street address or rural route';
  @Input() maxlength: string = '250';
  @Input() labelforId: string = 'street_' + this.objectId;
  @Input() useGeoCoder: boolean = false;
  @Input() placeholder: string = 'Street name';

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
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<GeoAddressResult> = new EventEmitter<GeoAddressResult>();

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

  _defaultErrMsg: ErrorMessage = {
    required:  LabelReplacementTag + ' is required.',
    invalidChar: LabelReplacementTag + ' must contain letters, and numbers and may include special characters such as hyphen, ' +
                 'period, apostrophe, number sign, ampersand and blank characters.'
  };


  constructor( @Optional() @Self() public controlDir: NgControl,
               private geocoderService: GeocoderService ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    // console.log( 'GeoCoder: ', this.useGeoCoder );

    super.ngOnInit();

    // Set up for using GeoCoder
    this.typeaheadList$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // Trigger the network request, get results
      switchMap(searchPhrase => {
        return this.geocoderService.lookup(searchPhrase);
      }),
      // tap(log => console.log('taplog', log)),
      catchError(() => this.onError())
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

  onBlur( event: any ) {
    this._onTouched( event );
    this.blur.emit( event );
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
        this.street = value;
    }
  }

  // @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    console.log( 'onKeyUp: ', event );
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

  onError(): Observable<GeoAddressResult[]> {
    // Empty array simulates no result response, nothing for typeahead to iterate over
    return of([]);
  }

  onSelect(event: TypeaheadMatch): void {
    // console.log( 'onSelect: ', event.item );
    const data: GeoAddressResult = event.item;
    this.street = data.street;

    // Set to defaults in response
    data.country = CANADA;
    data.province = BRITISH_COLUMBIA;
    this.select.emit( data );
  }

}
