import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GeocoderInputComponent } from './geocoder-input.component';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { GeocoderService } from '../../services/geocoder.service';
import { Address } from '../../models/address.model';


describe('GeocoderInputComponent', () => {
  let component: GeocoderInputComponent;
  let fixture: ComponentFixture<GeocoderInputComponent>;

  let lookupSpy;
  let geoService;

  // The result when user searches '784 y' - after GeocoderService has processed it
  const yatesResponse = [
    {fullAddress: '784 Yates St, Victoria, BC', city: 'Victoria', street: '784 Yates St', country: 'Canada', province: 'British Columbia'},
    {fullAddress: '784 Young Rd, Kelowna, BC', city: 'Kelowna', street: '784 Young Rd', country: 'Canada', province: 'British Columbia'}
  ];

  beforeEach(async(() => {

    geoService = jasmine.createSpyObj('GeocoderService', ['lookup']);
    lookupSpy = geoService.lookup.and.returnValue( of(yatesResponse) );

    TestBed.configureTestingModule({
      declarations: [ GeocoderInputComponent ],
      providers: [
        {provide: GeocoderService, useValue: geoService}
      ],
      imports: [ FormsModule, TypeaheadModule.forRoot(), HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocoderInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call GeocoderService.lookup() after initialization', () => {
    expect(lookupSpy.calls.any()).toBe(false, 'GeoCoderService.lookup() should not be called on component load');
  });

  it('should call GeoCoderService.lookup() on a keyUp event', fakeAsync(() => {
    // This simulates the typeahead input's behaviour by subscribing to the observable in the template
    component.typeaheadList$.subscribe();

    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    component.onKeyUp(keyEvent);

    tick(500); // same as debounceTime()

    expect(lookupSpy.calls.any()).toBe(true, 'GeoCoderService.lookup() should be called after KeyUp event');
  }));

  it('should emit an address when one is selected from typeahead', fakeAsync(() => {
    let typeaheadMatch: any;
    component.typeaheadList$.subscribe(x => {
      typeaheadMatch = { item: x[0] };
      // Simulate user has selected the first typeahead item (i.e. enter/tab/clicked on first item)
      component.onSelect(typeaheadMatch);
    });

    // Check for @Output emit, triggered via the .onSelect() above
    component.addressChange.subscribe((address: Address) => {
      expect(address).toBeDefined('Address should be emitted after calling component.onSelect()');
      // tslint:disable-next-line: max-line-length
      // expect(address._geocoderFullAddress).toBe(typeaheadMatch.item.fullAddress, 'Address _geocoderFullAddress should equal typeahead match ');
      expect(address.street).toBe(typeaheadMatch.item.street, 'Address street should match typeahead value');
      expect(address.city).toBe(typeaheadMatch.item.city, 'Address city should match typeahead value');
      expect(address.province).toBe(typeaheadMatch.item.province, 'Address province should match typeahead value');
      expect(address.country).toBe(typeaheadMatch.item.country, 'Address country should match typeahead value');
    });

    // Now that listeners are setup, trigger the user input and kick if off
    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    component.onKeyUp(keyEvent);
    tick(500); // same as debounceTime()
  }));

  it('should properly show when no results', () => {
    // This is not testing the typeaheadNoResults directive since it's a 3rd
    // party dep, but rather that the method it calls properly updates when
    // passed a boolean

    // Check data
    component.search = 'example';
    fixture.detectChanges();
    component.onNoResults(true);
    expect(component.hasNoResults).toBe(true);

    // Check UI
    const el = fixture.nativeElement.querySelector('.geocoder-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('No Results', '"No Results" text should be displayed to user');
  });

  it('should show an error on network failure', fakeAsync(() => {
    // Force the geocoder service to return an error, then make sure data and UI are updated
    lookupSpy = geoService.lookup.and.returnValue( throwError('Geocoder error') );
    component.typeaheadList$.subscribe();

    // Now that listeners are setup, trigger the user input and kick if off
    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    expect(component.hasError).toBe(false, 'should not have error before searching');
    component.onKeyUp(keyEvent);
    tick(500); // same as debounceTime()
    expect(component.hasError).toBe(true, 'should have error after GeocoderService throws an error');

    const el = fixture.nativeElement.querySelector('.geocoder-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('Error', 'Error msg should be displayed to user');
  }));

});
