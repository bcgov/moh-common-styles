import { fakeAsync } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PhnComponent } from './phn.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { createTestingModule,
  tickAndDetectChanges,
  getDebugElement,
  getDebugLabel,
  setInput,
 } from '../../../helpers/test-helpers';

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
      phn2: [ this.phn2 ]
    });
  }

  setPhnRequired( phnFldName: string ) {
    const fld = this.form.controls[phnFldName];

    fld.setValidators( Validators.required );
    fld.updateValueAndValidity();
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
         directives,
         true,
         importDirectives
      );

      const de = getDebugElement( fixture, 'common-phn', 'phn1' );
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( de ).toBeTruthy();
      expect( label ).toBe( fixture.componentInstance.defaultLabel );
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         directives,
         true,
         importDirectives
      );

      fixture.componentInstance.setPhnRequired( 'phn1') ;
      tickAndDetectChanges( fixture );

      const de = getDebugElement( fixture, 'common-phn', 'phn1' );
      expect( de ).toBeTruthy();
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    it('should be invalid (self validation)', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const de = getDebugElement( fixture, 'common-phn', 'phn1' );
      setInput( de, '9999999999' );

      tickAndDetectChanges( fixture );
      expect( de.componentInstance.controlDir.hasError( 'invalid' ) ).toBeTruthy();
    }));

    it('should be valid (self validation)', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const de = getDebugElement( fixture, 'common-phn', 'phn1' );
      setInput( de, '9999999998' );

      tickAndDetectChanges( fixture );
      expect( de.componentInstance.controlDir.hasError( 'invalid' ) ).toBeFalsy();
    }));

    it('should be able to have multiple components in form', fakeAsync(() => {
      const fixture = createTestingModule( PhnReactTestComponent,
        `<form [formGroup]="form">
          <common-phn name='phn1' formControlName='phn1'></common-phn>
          <common-phn name='phn2' formControlName='phn2'></common-phn>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const de1 = getDebugElement( fixture, 'common-phn', 'phn1' );
      setInput( de1, '9999999999' );

      const de2 = getDebugElement( fixture, 'common-phn', 'phn2' );
      setInput( de2, '9999999998' );

      tickAndDetectChanges( fixture );
      expect( de1.componentInstance.controlDir.hasError( 'invalid' ) ).toBeTruthy();
      expect( de2.componentInstance.controlDir.hasError( 'invalid' ) ).toBeFalsy();
    }));
  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn2' [(ngModel)]='phn2'></common-phn>
         </form>`,
         directives,
         false,
         importDirectives
      );

      const de = getDebugElement( fixture, 'common-phn', 'phn2' );
      const label = getDebugLabel( de, de.componentInstance.labelforId );

      expect( de ).toBeTruthy();
      expect( label ).toBe( fixture.componentInstance.defaultLabel );
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn2' [(ngModel)]='phn2' required></common-phn>
         </form>`,
         directives,
         false,
         importDirectives
      );

      fixture.whenStable().then( () => {
        const de = getDebugElement( fixture, 'common-phn', 'phn2' );
        expect( de ).toBeTruthy();
        expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      });
    }));

    it('should be invalid (self validation)', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn2' [(ngModel)]='phn2'></common-phn>
         </form>`,
         directives,
         false,
         importDirectives
      );

      fixture.whenStable().then( () => {
        const de = getDebugElement( fixture, 'common-phn', 'phn2' );
        setInput( de, '9999999999' );

        tickAndDetectChanges( fixture );

        expect( de.componentInstance.controlDir.hasError( 'invalid' ) ).toBeTruthy();
      });
    }));

    it('should not be invalid (self validation)', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn2' [(ngModel)]='phn2'></common-phn>
         </form>`,
         directives,
         false,
         importDirectives
      );

      fixture.whenStable().then( () => {
        const de = getDebugElement( fixture, 'common-phn', 'phn2' );
        setInput( de, '9999999998' );

        tickAndDetectChanges( fixture );
        expect( de.componentInstance.controlDir.hasError( 'invalid' ) ).toBeFalsy();
      });
    }));

    it('should be able to have multiple components in form', fakeAsync(() => {
      const fixture = createTestingModule( PhnTestComponent,
        `<form>
          <common-phn name='phn1' [(ngModel)]='phn1'></common-phn>
          <common-phn name='phn2' [(ngModel)]='phn2'></common-phn>
         </form>`,
         directives,
         false,
         importDirectives
      );

      fixture.whenStable().then( () => {
        const de1 = getDebugElement( fixture, 'common-phn', 'phn1' );
        setInput( de1, '9999999998' );

        const de2 = getDebugElement( fixture, 'common-phn', 'phn2' );
        setInput( de2, '9999999999' );

        tickAndDetectChanges( fixture );
        expect( de1.componentInstance.controlDir.hasError( 'invalid' ) ).toBeFalsy();
        expect( de2.componentInstance.controlDir.hasError( 'invalid' ) ).toBeTruthy();
      });
    }));
  });

});



