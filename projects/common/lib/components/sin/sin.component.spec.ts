import { fakeAsync } from '@angular/core/testing';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { SinComponent } from './sin.component';
import { tickAndDetectChanges, createTestingModule, getDebugElement, getDebugLabel } from '../../../helpers/test-helpers';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { commonDuplicateCheck } from '../duplicate-check/duplicate-check.directive';


@Component({
  template: ``
})
class SinTestComponent {
  @ViewChildren(SinComponent) sinComponent: QueryList<SinComponent>;

  sin1: string;
  sin2: string;

  defaultLabel: string = 'Social Insurance Number (SIN)';
}

@Component({
  template: ``,
})
class SinReactTestComponent extends SinTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      sin1: [ this.sin1 ],
      sin2: [ this.sin2 ,  commonDuplicateCheck( ['123456782'] ) ]

    });
  }
}

const directives: any[] = [ ErrorContainerComponent, SinComponent ];
const importDirectives: any[] = [ TextMaskModule ];

describe('SinComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( SinReactTestComponent,
        `<form [formGroup]="form">
          <common-sin name='sin1' formControlName='sin1'></common-sin>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const de = getDebugElement( fixture, 'common-sin', 'sin1');
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( component.sinComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.form.get('sin1').hasError( 'required' )  ).toBeFalsy();
    }));


    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( SinReactTestComponent,
        `<form [formGroup]="form">
          <common-sin name='sin1' formControlName='sin1' required></common-sin>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.sinComponent ).toBeTruthy();
      expect( component.form.get('sin1').hasError( 'required' )  ).toBeTruthy();
    }));

    it('should be invalid', fakeAsync(() => {
      const fixture = createTestingModule( SinReactTestComponent,
        `<form [formGroup]="form">
          <common-sin name='sin1' formControlName='sin1'></common-sin>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'sin1' ).setValue( '123456789' );
      tickAndDetectChanges( fixture );
      expect( component.sinComponent ).toBeTruthy();
      expect( component.form.get('sin1').hasError( 'invalid' ) ).toBeTruthy();
    }));

    it('should be valid', fakeAsync(() => {
      const fixture = createTestingModule( SinReactTestComponent,
        `<form [formGroup]="form">
          <common-sin name='sin1' formControlName='sin1'></common-sin>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'sin1' ).setValue( '123456782' );
      tickAndDetectChanges( fixture );
      expect( component.sinComponent ).toBeTruthy();
      expect( component.form.get('sin1').valid  ).toBeTruthy();
    }));

    it('should be duplicate', fakeAsync(() => {
      const fixture = createTestingModule( SinReactTestComponent,
        `<form [formGroup]="form">
          <common-sin name='sin2' formControlName='sin2'></common-sin>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'sin2' ).setValue( '123456782' );
      tickAndDetectChanges( fixture );
      expect( component.sinComponent ).toBeTruthy();
      expect( component.form.get('sin2').hasError( 'duplicate' ) ).toBeTruthy();
    }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( SinTestComponent,
        `<form>
          <common-sin name='sin1' [(ngModel)]='sin1'></common-sin>
         </form>`,
         directives,
         false,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const de = getDebugElement( fixture, 'common-sin', 'sin1');
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( component.sinComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.sinComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    /*
    it('should be disabled', fakeAsync(() => {
      const fixture = createTestingModule(
        SinTestComponent,
        `<common-sin name='sin' [(ngModel)]="value" disabled></common-sin>`
        );

      tickAndDetectChanges( fixture );
      expect(fixture.componentInstance.sinComponent.first.controlDir.disabled).toBe(true);
    }));

    it('should be set sin value', fakeAsync(() => {
      const fixture = createTestingModule(
        SinTestComponent,
        `<common-sin name='sin' [(ngModel)]="value"></common-sin>`
        );

      tickAndDetectChanges( fixture );
      fixture.componentInstance.sin1 = '041771651';
      tickAndDetectChanges( fixture );
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.input.sin).toBe( '041771651' );
      });
    }));*/
  });
});





