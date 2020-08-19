import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AddressValidatorComponent } from './address-validator.component';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Address } from '../../models/address.model';

describe('AddressValidatorComponent', () => {
  let component: AddressValidatorComponent;
  let fixture: ComponentFixture<AddressValidatorComponent>;

  // The result when user searches '784 y'.
  const yatesResponse = [
    {fullAddress: '784 Yates St, Victoria, BC', city: 'Victoria', street: '784 Yates St', country: 'Canada', province: 'British Columbia'},
    {fullAddress: '784 Young Rd, Kelowna, BC', city: 'Kelowna', street: '784 Young Rd', country: 'Canada', province: 'British Columbia'}
  ];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ AddressValidatorComponent ],
      imports: [
        FormsModule,
        TypeaheadModule.forRoot(),
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressValidatorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
    const el = fixture.nativeElement.querySelector('.address-validator-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('No Results', '"No Results" text should be displayed to user');
  });
});
