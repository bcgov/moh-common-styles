import { StreetComponent } from './street.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { fakeAsync } from '@angular/core/testing';
import { createTestingModule, tickAndDetectChanges, getDebugElement, getDebugLabel } from '../../../helpers/test-helpers';
import { GeoAddressResult } from '../../services/geocoder.service';
@Component({
  template: ``
})
class StreetTestComponent {
  @ViewChildren(StreetComponent) streetComponent: QueryList<StreetComponent>;

  street1: string;
  street2: string;
  street3: string;

  defaultLabel: string = 'Full street address or rural route';

    geoResult: GeoAddressResult;
}

@Component({
  template: ``,
})
class StreetReactTestComponent extends StreetTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      street1: [ this.street1 ],
      street2: [ this.street2 ],
      street3: [ this.street3 ]
    });
  }

  onSelect($event) {
    console.log('updateOn: ', $event );
    this.geoResult = $event;
  }

}

const directives: any[] = [ ErrorContainerComponent, StreetComponent ];
const importDirectives: any[] = [ HttpClientTestingModule, TypeaheadModule.forRoot() ];

describe('StreetComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( StreetReactTestComponent,
        `<form [formGroup]="form">
          <common-street name='street1' formControlName='street1'></common-street>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );

      const de = getDebugElement( fixture, 'common-street', 'street1');
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( component.streetComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.form.get('street1').hasError( 'required' )  ).toBeFalsy();
    }));

/* TODO: Figure out how to test GeoCoder
    xit('should use GeoCoder', fakeAsync(() => {
      const fixture = createTestingModule( StreetReactTestComponent,
        `<form [formGroup]="form">
          <common-street name='street3' formControlName='street3'
                         [useGeoCoder]='true'
                         (select)="onSelect($event)"></common-street>
         </form>`,
         directives,
         true,
         importDirectives,
         //[GeocoderService]
      );

      const component = fixture.componentInstance;
      const el = getInputElement( fixture, 'common-street', 'street3');
      el.value = '716 ';
      el.dispatchEvent( new KeyboardEvent('keyup', { key: 'Y', } ));
      el.dispatchEvent( new Event( 'input' ) );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {


        console.log( 'geocoder result: ', component.geoResult,
        component.form.get('street3').value );
      });
    }));
    */

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( StreetTestComponent,
        `<form>
          <common-street name='street1' [(ngModel)]='street1'></common-street>
         </form>`,
         directives,
         false,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const de = getDebugElement( fixture, 'common-street', 'street1');
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( component.streetComponent ).toBeTruthy();
      expect( label ).toBe( component.defaultLabel );
      expect( component.streetComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    /* TODO: Figure out how to test GeoCoder
    it('should use GeoCoder', fakeAsync(() => {
      const fixture = createTestingModule( StreetTestComponent,
        `<form>
          <common-street name='street3' [(ngModel)]='street3'
                         [useGeoCoder]='true'
                         (select)="onSelect($event)"></common-street>
         </form>`,
         directives,
         false,
         importDirectives,
         //[GeocoderService]
      );

      const component = fixture.componentInstance;
      const el = getInputElement( fixture, 'common-street', 'street3');
      el.value = '716 ';
      el.dispatchEvent( new KeyboardEvent('keyup', { key: 'Y', } ));
      el.dispatchEvent( new Event( 'input' ) );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {


        console.log( 'geocoder result: ', component.geoResult, component.street3 );
      });
    }));
    */

  });
});
