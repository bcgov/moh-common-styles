import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CityComponent } from './city.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tickAndDetectChanges, getInputElement, getLabel, createTestingModule } from '../../../helpers/test-helpers';
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

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-city', 'city1');
      const label = getLabel( fixture, 'common-city', el.id );

      expect( component.cityComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.form.get('city1').hasError( 'required' )  ).toBeFalsy();
      }));

      it('should be required', fakeAsync(() => {
        const fixture = createTestingModule( CityReactTestComponent,
          `<form [formGroup]="form">
            <common-city name='city2' formControlName='city2' required></common-city>
           </form>`,
           directives,
           true
        );

        const component = fixture.componentInstance;
        tickAndDetectChanges( fixture );

        expect( component.cityComponent ).toBeTruthy();
        expect( component.form.get('city2').hasError( 'required' )  ).toBeTruthy();
        }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( CityTestComponent,
        `<form>
          <common-city name='city1' [(ngModel)]='city1'></common-city>
         </form>`,
         directives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-city', 'city1');
      const label = getLabel( fixture, 'common-city', el.id );

      expect( component.cityComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.cityComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));
  });

});
