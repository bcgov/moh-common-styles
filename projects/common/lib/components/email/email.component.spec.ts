import { EmailComponent } from './email.component';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { createTestingModule, tickAndDetectChanges, getInputElement, getLabel } from '../../../helpers/test-helpers';
import { fakeAsync } from '@angular/core/testing';

@Component({
  template: ``
})
class EmailTestComponent {
  @ViewChildren(EmailComponent) emailComponent: QueryList<EmailComponent>;

  email1: string;
  email2: string;

  defaultLabel: string = 'Email';
}

@Component({
  template: ``,
})
class EmailReactTestComponent extends EmailTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      email1: [ this.email1 ],
      email2: [ this.email2, Validators.required ]
    });
  }
}

const directives: any[] = [ ErrorContainerComponent, EmailComponent ];

describe('EmailComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email1' formControlName='email1'></common-email>
         </form>`,
         directives,
         true
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-email', 'email1');
      const label = getLabel( fixture, 'common-email', el.id );

      expect( component.emailComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.form.get('email1').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email2' formControlName='email2'></common-email>
         </form>`,
         directives,
         true
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.emailComponent ).toBeTruthy();
      expect( component.form.get('email2').hasError( 'required' )  ).toBeTruthy();
    }));

    it('should be invalid', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email1' formControlName='email1'></common-email>
         </form>`,
         directives,
         true
      );

      const component = fixture.componentInstance;
      component.form.get( 'email1' ).setValue( '234is@kjest' );
      tickAndDetectChanges( fixture );
      expect( component.emailComponent ).toBeTruthy();
      expect( component.form.get('email1').hasError( 'invalidEmail' ) ).toBeTruthy();
    }));

    it('should be valid', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email1' formControlName='email1'></common-email>
         </form>`,
         directives,
         true
      );

      const component = fixture.componentInstance;
      component.form.get( 'email1' ).setValue( 'test@test.com' );
      tickAndDetectChanges( fixture );
      expect( component.emailComponent ).toBeTruthy();
      expect( component.form.get('email1').valid  ).toBeTruthy();
    }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-email', 'email1');
      const label = getLabel( fixture, 'common-email', el.id );

      expect( component.emailComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.emailComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1' required></common-email>
         </form>`,
         directives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-email', 'email1');

      expect( component.emailComponent ).toBeTruthy();
      expect( component.emailComponent.first.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    // TODO: Figure out why value is not being set
    xit('should be invalid', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-email', 'email1');
      el.value = 'testlklsd@ksdlkd';
      el.dispatchEvent( new Event( 'input' ) );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        expect( component.emailComponent.first.controlDir.hasError( 'invalidEmail' ) ).toBeTruthy();
      });
    }));

    // TODO: Figure out why value is not being set
    xit('should be valid', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-email', 'email1');
      console.log( 'el: ', el );
      el.value = 'testlklsd@test.com';
      el.dispatchEvent( new Event( 'input' ) );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        console.log( 'value: ', component.email1 );
        expect( component.emailComponent.first.controlDir.hasError( 'invalidEmail' ) ).toBeFalsy();
      });
    }));
  });
});
