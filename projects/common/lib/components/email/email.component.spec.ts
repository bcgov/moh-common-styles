import { EmailComponent } from './email.component';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { createTestingModule,
  tickAndDetectChanges,
  getDebugElement,
  getDebugLabel,
  setInput,
  getInputDebugElement,
  getDebugInlineError} from '../../../helpers/test-helpers';
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
      const de = getDebugElement( fixture, 'common-email', 'email1');
      tickAndDetectChanges( fixture );

      expect( de ).toBeTruthy();
      expect( getDebugLabel( de, de.componentInstance.labelforId ) ).toBe( component.defaultLabel );
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
      const de = getDebugElement( fixture, 'common-email', 'email2');
      tickAndDetectChanges( fixture );
      expect( de ).toBeTruthy();
      expect( component.form.get('email2').hasError( 'required' )  ).toBeTruthy();
    }));

    it('should be invalid when format is incorrect', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email1' formControlName='email1'></common-email>
         </form>`,
         directives,
         true
      );

      const de = getDebugElement( fixture, 'common-email', 'email1');
      const input = getInputDebugElement( de, de.componentInstance.labelforId );

      setInput( input, '234is@jest' );
      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        expect( de ).toBeTruthy();
        // console.log( 'errors: ', de.componentInstance.controlDir.errors );
        expect( de.componentInstance.controlDir.hasError( 'invalidEmail' ) ).toBeTruthy();
      });
    }));

    it('should be valid when format is correct', fakeAsync(() => {
      const fixture = createTestingModule( EmailReactTestComponent,
        `<form [formGroup]="form">
          <common-email name='email1' formControlName='email1'></common-email>
         </form>`,
         directives,
         true
      );

      const component = fixture.componentInstance;
      const de = getDebugElement( fixture, 'common-email', 'email1');
      const input = getInputDebugElement( de, de.componentInstance.labelforId );
      setInput( input, 'test@test.com' );

      tickAndDetectChanges( fixture );
      expect( de ).toBeTruthy();
      expect( de.componentInstance.controlDir.hasError( 'invalidEmail' )   ).toBeFalsy();
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
      const de = getDebugElement( fixture, 'common-email', 'email1');
      tickAndDetectChanges( fixture );

      expect( de ).toBeTruthy();
      expect( getDebugLabel( de, de.componentInstance.labelforId ) ).toBe( component.defaultLabel );

      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should be required', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1' required></common-email>
         </form>`,
         directives
      );

      const de = getDebugElement( fixture, 'common-email', 'email1');
      tickAndDetectChanges( fixture );

      expect( de ).toBeTruthy();
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    it('should be invalid when format is incorrect', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const de = getDebugElement( fixture, 'common-email', 'email1');
      const input = getInputDebugElement( de, de.componentInstance.labelforId );
      setInput( input, 'testlklsd@ksdlkd' );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        expect( de.componentInstance.controlDir.hasError( 'invalidEmail' ) ).toBeTruthy();
      });
    }));

    it('should be valid when format is correct', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const de = getDebugElement( fixture, 'common-email', 'email1');
      const input = getInputDebugElement( de, de.componentInstance.labelforId );
      setInput( input, 'ttestlklsd@test.com' );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        expect( de.componentInstance.controlDir.hasError( 'invalidEmail' ) ).toBeFalsy();
      });
    }));

    it('should be invalid where non-printable ascii characters are present', fakeAsync(() => {
      const fixture = createTestingModule( EmailTestComponent,
        `<form>
          <common-email name='email1' [(ngModel)]='email1'></common-email>
         </form>`,
         directives
      );

      const de = getDebugElement( fixture, 'common-email', 'email1');
      const input = getInputDebugElement( de, de.componentInstance.labelforId );
      const nonPrintable = String.fromCharCode(0x00E4, 0x00F4);
      setInput( input, 'testlklsd' + nonPrintable  + '@ksdlkd.com' );

      tickAndDetectChanges( fixture );
      fixture.whenStable().then( () => {
        expect( de.componentInstance.controlDir.hasError( 'invalidChars' ) ).toBeTruthy();
      });
    }));

  });
});
