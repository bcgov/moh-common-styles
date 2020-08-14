import { fakeAsync } from '@angular/core/testing';
import { CityComponent } from './city.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tickAndDetectChanges, createTestingModule, getDebugElement, getDebugLabel, setInput } from '../../../helpers/test-helpers';
import { ErrorContainerComponent } from '../error-container/error-container.component';


@Component({
  template: ``
})
class CityTestComponent {
  @ViewChildren(CityComponent) cityComponent: QueryList<CityComponent>;

  city1: string;
  city2: string;

  defaultLabel: string = 'City';
}

@Component({
  template: ``,
})
class CityReactTestComponent extends CityTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      city1: [ this.city1 ],
      city2: [ this.city2 ]
    });
  }

  setCityRequired( phnFldName: string ) {
    const fld = this.form.controls[phnFldName];

    fld.setValidators( Validators.required );
    fld.updateValueAndValidity();
  }
}

const directives: any[] = [ ErrorContainerComponent, CityComponent ];

describe('CityComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( CityReactTestComponent,
        `<form [formGroup]="form">
          <common-city name='city1' formControlName='city1'></common-city>
         </form>`,
         directives,
         true
      );

        const de = getDebugElement( fixture, 'common-city', 'city1');
        const label = getDebugLabel( de, de.componentInstance.labelforId );

        expect( de ).toBeTruthy();
        expect( label ).toBe( fixture.componentInstance.defaultLabel );
      }));

      it('should be required', fakeAsync(() => {
        const fixture = createTestingModule( CityReactTestComponent,
          `<form [formGroup]="form">
            <common-city name='city1' formControlName='city1'></common-city>
           </form>`,
           directives,
           true
        );

        fixture.componentInstance.setCityRequired( 'city1') ;
        tickAndDetectChanges( fixture );

        const de = getDebugElement( fixture, 'common-city', 'city1');
        const label = getDebugLabel( de, de.componentInstance.labelforId );

        expect( de ).toBeTruthy();
        expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      }));

      it('should not have required error', fakeAsync(() => {
        const fixture = createTestingModule( CityReactTestComponent,
          `<form [formGroup]="form">
            <common-city name='city1' formControlName='city1'></common-city>
           </form>`,
           directives,
           true
        );

        fixture.componentInstance.setCityRequired( 'city1' ) ;
        tickAndDetectChanges( fixture );

        const de = getDebugElement( fixture, 'common-city', 'city1');
        setInput( de, 'My City' );

        tickAndDetectChanges( fixture );
        expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeFalsy();
      }));

    });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( CityTestComponent,
        `<form>
          <common-city name='city2' [(ngModel)]='city2'></common-city>
         </form>`,
         directives
      );

      fixture.whenStable().then( () => {
        const de = getDebugElement( fixture, 'common-city', 'city2');
        const label = getDebugLabel( de, de.componentInstance.labelforId );

        expect( de ).toBeTruthy();
        expect( label ).toBe( fixture.componentInstance.defaultLabel );
      });
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( CityTestComponent,
        `<form>
          <common-city name='city2' [(ngModel)]='city2' required></common-city>
         </form>`,
         directives
      );

      fixture.whenStable().then( () => {
        const de = getDebugElement( fixture, 'common-city', 'city2');
        const label = getDebugLabel( de, de.componentInstance.labelforId );

        expect( de ).toBeTruthy();
        expect( label ).toBe( fixture.componentInstance.defaultLabel );
        expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      });
    }));

  });

});

