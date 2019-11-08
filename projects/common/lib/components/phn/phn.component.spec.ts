import { ComponentFixture, fakeAsync } from '@angular/core/testing';
import {FormGroup, FormBuilder} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {PhnComponent} from './phn.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { createTestingModule, tickAndDetectChanges } from '../../../helpers/test-helpers';
import { commonDuplicateCheck } from '../duplicate-check/duplicate-check.directive';

@Component({
  template: ``,
})
class PhnTestComponent {

  @ViewChildren(PhnComponent) phnComponent: QueryList<PhnComponent>;
  phn1: string;
  phn2: string;

  defaultLabel: string = 'Personal Health Number (PHN)';

  constructor() {}
}

@Component({
  template: ``,
})
class PhnReactTestComponent extends PhnTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      phn1: [ this.phn1 ],
      phn2: [ this.phn2 ,  commonDuplicateCheck( ['9999999998'] ) ]

    });
  }
}

const directives: any[] = [ ErrorContainerComponent, PhnComponent ];
const importDirectives: any[] = [ TextMaskModule ];

describe('PhnComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         true,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getElement( fixture, 'phn1');
      const label = getLabel( fixture, el.id );

      expect( component.phnComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.form.get('phn1').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1' required></common-phn>
         </form>`,
         true,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.phnComponent ).toBeTruthy();
      expect( component.form.get('phn1').hasError( 'required' )  ).toBeTruthy();
    }));

    it('should be invalid', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         true,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'phn1' ).setValue( '9999999999' );
      tickAndDetectChanges( fixture );
      expect( component.phnComponent ).toBeTruthy();
      expect( component.form.get('phn1').hasError( 'invalid' ) ).toBeTruthy();
    }));

    it('should be valid', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         true,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'phn1' ).setValue( '9999999998' );
      tickAndDetectChanges( fixture );
      expect( component.phnComponent ).toBeTruthy();
      expect( component.form.get('phn1').valid  ).toBeTruthy();
    }));

    it('should be duplicate', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn2' formControlName='phn2'></common-phn>
         </form>`,
         true,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      component.form.get( 'phn2' ).setValue( '9999999998' );
      tickAndDetectChanges( fixture );
      expect( component.phnComponent ).toBeTruthy();
      expect( component.form.get('phn2').hasError( 'duplicate' ) ).toBeTruthy();
    }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn1' [(ngModel)]='phn1'></common-phn>
         </form>`,
         false,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getElement( fixture, 'phn1');
      const label = getLabel( fixture, el.id );

      expect( component.phnComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.phnComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn1' [(ngModel)]='phn1' required></common-phn>
         </form>`,
         false,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;

      tickAndDetectChanges( fixture );
     // const error = getErrorContainer( fixture );
     // console.log( 'error: ', error );
      expect( component.phnComponent.first.controlDir.hasError( 'required' ) ).toBeTruthy();
      // expect( error.textContent ).toContain( 'is required' );
    }));


    /*
    it('should be invalid', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn1' [(ngModel)]='phn1'></common-phn>
         </form>`,
         false,
         directives,
         importDirectives
      );

      const component = fixture.componentInstance;

      fixture.whenStable().then( () => {
        component.phn1 = '9999999999';
        tickAndDetectChanges( fixture );
        // const error = getErrorContainer( fixture );
        // console.log( 'error: ', error );
         expect( component.phnComponent.first.controlDir.hasError( 'invalue' ) ).toBeTruthy();
         // expect( error.textContent ).toContain( 'is required' );
      });
    })); */


  });

});


function getControl( fixture: ComponentFixture<any>, name: string ) {
  const selector = 'common-phn[name=' + name + ']';
  return fixture.nativeElement.querySelector( selector );
}

function getElement( fixture: ComponentFixture<any>, name: string ) {
  const selector = 'common-phn[name=' + name + '] input';
  return fixture.nativeElement.querySelector( selector );
}

function getLabel( fixture: ComponentFixture<any>, name: string ) {
  const selector = 'common-phn label[for=' + name + '] ';
  return fixture.nativeElement.querySelector( selector );
}
