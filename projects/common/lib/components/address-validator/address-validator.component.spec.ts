import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddressValidatorComponent } from './address-validator.component';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule, TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Address } from '../../models/address.model';
import { createTestingModule, tickAndDetectChanges, getDebugElement, getDebugLabel } from '../../../helpers/test-helpers';


@Component({
  template: ``,
})
class AddressValidatorTestComponent {

  @ViewChildren(AddressValidatorComponent) addressValidatorComponent: QueryList<AddressValidatorComponent>;
  address: string;

  defaultLabel: string = 'Address Lookup ';

  constructor() {}
}

@Component({
  template: ``,
})
class AddressValidatorReactTestComponent extends AddressValidatorTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      address: [ this.address ],
    });
  }
}


describe('AddressValidatorComponent', () => {
  let component: AddressValidatorComponent;
  let fixture;

  // The result when user searches '784 y'.
  const yatesResponse = [
    {
      AddressComplete: '784 Yates St, Victoria, BC',
      City: 'Victoria',
      DeliveryAddressLines: '784 Yates St',
      Country: 'Canada',
      Province: 'British Columbia'
    },
    {
      AddressComplete: '784 Young Rd, Kelowna, BC',
      City: 'Kelowna',
      DeliveryAddressLines: '784 Young Rd',
      Country: 'Canada',
      Province: 'British Columbia'
    }
  ];

  let httpClientStub = {
    get: jasmine.createSpy('get').and.returnValue(of({Address: []}))
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ AddressValidatorComponent ],
      imports: [
        FormsModule,
        TypeaheadModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientStub }
      ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should emit an address when one is selected from typeahead', fakeAsync(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    let typeaheadMatch: any;
    spyOn(component, 'lookup').and.returnValue(of(yatesResponse));
    component.typeaheadList$.subscribe(x => {
      typeaheadMatch = { item: x[0] };
      // Simulate user has selected the first typeahead item (i.e. enter/tab/clicked on first item)
      component.onSelect(typeaheadMatch);
    });

    // Check for @Output emit, triggered via the .onSelect() above
    component.addressChange.subscribe((address: Address) => {
      expect(address).toBeDefined('Address should be emitted after calling component.onSelect()');
      // tslint:disable-next-line: max-line-length
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
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // This is not testing the typeaheadNoResults directive since it's a 3rd
    // party dep, but rather that the method it calls properly updates when
    // passed a boolean

    // Check data
    component.search = 'example';
    fixture.detectChanges();
    component.onNoResults(true);
    expect(component.hasNoResults).toBe(true);

    // Check UI
    const el = fixture.nativeElement.querySelector('.address-validator-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('No Results', '"No Results" text should be displayed to user');
  });

  it('should make HTTP request', fakeAsync(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    httpClientStub.get.calls.reset();
    const fakeAddress = '123 Main st';
    const fakeEndpoint = 'testEndpoint';
    component.serviceUrl = fakeEndpoint;

    component.lookup(fakeAddress);
    expect(httpClientStub.get).toHaveBeenCalledWith(fakeEndpoint, jasmine.any(Object));
  }));

  it('should emit select event when address selected', fakeAsync(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    spyOn(component.select, 'emit').and.returnValue(null);
    const mockEvent = {
      item: {
        DeliveryAddressLines: 'mock address'
      }
    } as TypeaheadMatch;

    component.onSelect(mockEvent);
    expect(component.select.emit).toHaveBeenCalledWith(jasmine.any(Address));
  }));

  it('should set `hasError` to true when encountering an error', fakeAsync(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    const mockError = {};
    component.onError(mockError);
    expect(component.hasError).toBe(true);
  }));

  it('should set `isTypeaheadLoading` to true when passed in `onLoading`.', fakeAsync(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;
    component.hasError = true;
    component.onLoading(true);
    expect(component.isTypeaheadLoading).toBe(true);
    expect(component.hasError).toBe(false);
  }));
});

describe('AddressValidatorComponent', () => {
  const directives: any[] = [ AddressValidatorComponent ];
  const importDirectives: any[] = [
    TypeaheadModule.forRoot(),
    HttpClientTestingModule
  ];

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( AddressValidatorReactTestComponent,
        `<form [formGroup]="form">
          <common-address-validator name='address' formControlName='address' label='Address Lookup'></common-address-validator>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const de = getDebugElement( fixture, 'common-address-validator', 'address' );
      const label = getDebugLabel( de, 'address-validator_Address Lookup' );

      expect( component.addressValidatorComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.form.get('address').hasError( 'required' ) ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( AddressValidatorReactTestComponent,
        `<form [formGroup]="form">
          <common-address-validator name='address' formControlName='address' required></common-address-validator>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.addressValidatorComponent ).toBeTruthy();
      expect( component.form.get('address').hasError( 'required' ) ).toBeTruthy();
    }));

    it('should be required, and not show error when filled out', fakeAsync(() => {
      const fixture = createTestingModule( AddressValidatorReactTestComponent,
        `<form [formGroup]="form">
          <common-address-validator name='address' formControlName='address' required></common-address-validator>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const testAddress = '123 Main st';
      const component = fixture.componentInstance;
      component.form.patchValue({
        address: testAddress
      })
      tickAndDetectChanges( fixture );
      expect( component.addressValidatorComponent ).toBeTruthy();
      expect( component.form.get('address').hasError( 'required' ) ).toBeFalsy();
      expect( component.form.controls['address'].value).toEqual(testAddress);
    }));
  });

  describe('Custom controls - Template', () => {
    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( AddressValidatorReactTestComponent,
        `<form>
          <common-address-validator name='address' [(ngModel)]='address'></common-address-validator>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const de = getDebugElement( fixture, 'common-address-validator', 'address' );
      const label = getDebugLabel( de, 'address-validator_Address Lookup' );

      expect( component.addressValidatorComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.form.get('address').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( AddressValidatorReactTestComponent,
        `<form>
          <common-address-validator name='address' [(ngModel)]='address' required></common-address-validator>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.addressValidatorComponent.first.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));
  });
});
