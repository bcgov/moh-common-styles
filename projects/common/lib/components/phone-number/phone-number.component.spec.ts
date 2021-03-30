import { fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PhoneNumberComponent } from './phone-number.component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { tickAndDetectChanges, createTestingModule } from '../../../helpers/test-helpers';
import { TextMaskModule } from 'angular2-text-mask';

@Component({
  template: ``,
})
class PhoneTestComponent {

  @ViewChild(PhoneNumberComponent, {static: true}) phoneComponent: PhoneNumberComponent;
  phone: string;

  constructor() {}
}

const directives: any[] = [ ErrorContainerComponent, PhoneNumberComponent ];
const importDirectives: any[] = [ TextMaskModule ];

@Component({
  template: ``,
})
class PhoneReactTestComponent extends PhoneTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      phoneNumber: [ this.phone ]
    });
  }
}

describe('PhoneNumberComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                  formControlName='phoneNumber'></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.phoneComponent ).toBeTruthy();
      expect( fixture.nativeElement.querySelector('label').textContent ).toBe( 'Phone Number' );
      expect( fixture.componentInstance.form.get('phoneNumber').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should be disabled', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                 formControlName='phoneNumber'></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );

      fixture.componentInstance.form.get('phoneNumber').disable();
      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.phoneComponent.disabled ).toBeTruthy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                 formControlName='phoneNumber' required></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.form.get('phoneNumber').hasError( 'required' ) ).toBeTruthy();
    }));

    it('should be incomplete value error', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                 formControlName='phoneNumber' required></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );
      const form = fixture.componentInstance.form;
      form.get('phoneNumber').setValue( '23555552' );
      tickAndDetectChanges( fixture );
      expect( form.get('phoneNumber').hasError( 'incompleteValue' ) ).toBeTruthy();
    }));

    it('should display phone number (default allow international numbers)', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                 formControlName='phoneNumber'></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );

      fixture.componentInstance.form.get('phoneNumber').setValue( '2355555252' );
      tickAndDetectChanges( fixture );
      expect( fixture.nativeElement.querySelector( 'input[type=text]'  ).value ).toEqual('+1 (235) 555-5252');
    }));

    it('should display phone number (not allow international numbers)', fakeAsync(() => {
      const fixture = createTestingModule( PhoneReactTestComponent,
          `<form [formGroup]="form">
            <common-phone-number name='phoneNumber' label='Phone Number'
                                 formControlName='phoneNumber' [allowInternational]='false'></common-phone-number>
          </form>`,
          directives,
          true,
          importDirectives
        );

      fixture.componentInstance.form.get('phoneNumber').setValue( '2355555252' );
      tickAndDetectChanges( fixture );
      expect( fixture.nativeElement.querySelector( 'input[type=text]' ).value ).toEqual('(235) 555-5252');
    }));
  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( PhoneTestComponent,
          `<form>
            <common-phone-number name="phoneNumber"
                                 [(ngModel)]='phone'
                                 label='Phone Number'></common-phone-number>
          </form>`,
          directives,
          false,
          importDirectives
        );

      tickAndDetectChanges( fixture );
      const component = fixture.componentInstance.phoneComponent;
      expect( component ).toBeTruthy();
      expect( fixture.nativeElement.querySelector('label').textContent ).toBe( 'Phone Number' );
      expect( component.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));
  });
});
