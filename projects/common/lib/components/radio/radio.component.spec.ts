import { fakeAsync } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RadioComponent, IRadioItems } from './radio.component';
import { Component, OnInit, DebugElement } from '@angular/core';
import { tickAndDetectChanges,
  createTestingModule,
  getDebugLegend,
  getDebugElement} from '../../../helpers/test-helpers';
import { ErrorContainerComponent } from '../error-container/error-container.component';


@Component({
  template: ``,
})
class RadioTestComponent {

  radio1: boolean;
  radio2: number;
  radio3: string;
  radio4: boolean;

  radioLabel1: string = 'Where you born in Canada?';

  radioLabel2: string = 'Which is a prime number?';
  radioButton2: IRadioItems[] = [
    {label: 'Zero', value: 0},
    {label: 'One', value: 1},
    {label: 'Two', value: 2}
  ];

  radioLabel3: string = 'Which color is your favorite?';
  radioButton3: IRadioItems[] = [
    {label: 'Green', value: 'green'},
    {label: 'Red', value: 'red'},
    {label: 'Yellow', value: 'yellow'},
    {label: 'Pink', value: 'pink'},
    {label: 'Blue', value: 'blue'}
  ];

  radioLabel4: string = 'Do you attend post-secondary school?';

  constructor() {}
}

@Component({
  template: ``,
})
class RadioReactTestComponent extends RadioTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      radioBtn1: [ this.radio1 ], // boolean
      radioBtn2: [ this.radio2 ], // number
      radioBtn3: [ this.radio3 ], // string
      radioBtn4: [ this.radio4 ], // boolean
    });
  }

  setBtnRequired( btnName: string ) {
    const fld = this.form.controls[btnName];

    fld.setValidators( Validators.required );
    fld.updateValueAndValidity();
  }
}

const directives: any[] = [ ErrorContainerComponent, RadioComponent ];

describe('RadioComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
            <common-radio name='radioBtn1' label='{{radioLabel1}}'
                         formControlName='radioBtn1'></common-radio>
        </form>`,
        directives,
        true
      );

      tickAndDetectChanges( fixture );

      const de = getDebugElement( fixture, 'common-radio', 'radioBtn1' );
      expect( de ).toBeTruthy();
      expect( getDebugLegend( de ) ).toBe( fixture.componentInstance.radioLabel1 );
      expect( getRadioBtnLabel( de, false )).toBe( 'No' );
      expect( getRadioBtnLabel( de, true )).toBe( 'Yes' );
    }));


    it('should create multiple radio components (string, boolean, number)', fakeAsync(() => {

      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">

          <common-radio name='radioBtn1' label='{{radioLabel1}}'
                        formControlName='radioBtn1'></common-radio>

          <common-radio name='radioBtn2' label='{{radioLabel2}}' [radioLabels]='radioButton2'
                        formControlName='radioBtn2'></common-radio>

          <common-radio name='radioBtn3' label='{{radioLabel3}}' [radioLabels]='radioButton3'
                        formControlName='radioBtn3'></common-radio>

          <common-radio name='radioBtn4' label='{{radioLabel4}}'
                        formControlName='radioBtn4'></common-radio>
        </form>`,
        directives,
        true
      );

      tickAndDetectChanges( fixture );

      const de1 = getDebugElement( fixture, 'common-radio', 'radioBtn1' );
      const de2 = getDebugElement( fixture, 'common-radio', 'radioBtn2' );
      const de3 = getDebugElement( fixture, 'common-radio', 'radioBtn3' );
      const de4 = getDebugElement( fixture, 'common-radio', 'radioBtn4' );

      expect( de1 ).toBeTruthy();
      expect( de2 ).toBeTruthy();
      expect( de3 ).toBeTruthy();
      expect( de4 ).toBeTruthy();
      expect( getDebugLegend( de1 ) ).toBe( fixture.componentInstance.radioLabel1 );
      expect( getDebugLegend( de2 ) ).toBe( fixture.componentInstance.radioLabel2 );
      expect( getDebugLegend( de3 ) ).toBe( fixture.componentInstance.radioLabel3 );
      expect( getDebugLegend( de4 ) ).toBe( fixture.componentInstance.radioLabel4 );

      fixture.componentInstance.radioButton2.forEach( element => {
        expect( getRadioBtnLabel( de2, element.value )).toBe( element.label );
      });

      fixture.componentInstance.radioButton3.forEach( element => {
        expect( getRadioBtnLabel( de3, element.value )).toBe( element.label );
      });
    }));


    it('should have error required', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
          <common-radio name='radioBtn4' label='{{radioLabel4}}'
                        formControlName='radioBtn4'></common-radio>
        </form>`,
        directives,
        true
      );

      fixture.componentInstance.setBtnRequired('radioBtn4');
      tickAndDetectChanges( fixture );

      const de = getDebugElement( fixture, 'common-radio', 'radioBtn4' );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    it('should not have error required', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
          <common-radio name='radioBtn4' label='{{radioLabel4}}'
                        formControlName='radioBtn4'></common-radio>
        </form>`,
        directives,
        true
      );
      fixture.componentInstance.setBtnRequired('radioBtn4');
      tickAndDetectChanges( fixture );

      const de =  getDebugElement( fixture, 'common-radio', 'radioBtn4' );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      clickValue( de, true );

      tickAndDetectChanges( fixture );

      expect( getCheckedValue( de ) ).toBe( 'true' );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should toggle radio button options', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
          <common-radio name='radioBtn1' label='{{radioLabel1}}'
                        formControlName='radioBtn1'></common-radio>

          <common-radio name='radioBtn2' label='{{radioLabel2}}' [radioLabels]='radioButton2'
                        formControlName='radioBtn2'></common-radio>

          <common-radio name='radioBtn3' label='{{radioLabel3}}' [radioLabels]='radioButton3'
                        formControlName='radioBtn3'></common-radio>
        </form>`,

        directives,
        true
      );
      fixture.whenStable().then( () => {
        const de1 =  getDebugElement( fixture, 'common-radio', 'radioBtn1' );
        const de2 =  getDebugElement( fixture, 'common-radio', 'radioBtn2' );
        const de3 =  getDebugElement( fixture, 'common-radio', 'radioBtn3' );

        clickValue( de1, true );
        clickValue( de2, 0 );
        clickValue( de3, 'blue' );

        tickAndDetectChanges( fixture );
        expect( getCheckedValue( de1 ) ).toBe( 'true' );
        expect( getCheckedValue( de2 ) ).toBe( '0' );
        expect( getCheckedValue( de3 ) ).toBe( 'blue' );

        clickValue( de1, false );
        clickValue( de2, 2 );
        clickValue( de3, 'pink' );

        tickAndDetectChanges( fixture );

        expect( getCheckedValue( de1 ) ).toBe( 'false' );
        expect( getCheckedValue( de2 ) ).toBe( '2' );
        expect( getCheckedValue( de3 ) ).toBe( 'pink' );
      });
    }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
        `<form>
          <common-radio name='radioBtn1' [(ngModel)]='radio1'
                        label='{{radioLabel1}}'></common-radio>
          </form>`,
          directives
      );

      tickAndDetectChanges( fixture );

      const de = getDebugElement( fixture, 'common-radio', 'radioBtn1' );
      expect( de ).toBeTruthy();
      expect( getDebugLegend( de ) ).toBe( fixture.componentInstance.radioLabel1 );
      expect( getRadioBtnLabel( de, false )).toBe( 'No' );
      expect( getRadioBtnLabel( de, true )).toBe( 'Yes' );
    }));

    it('should toggle radio button options', fakeAsync( () => {
      const fixture = createTestingModule( RadioTestComponent,
        `<form>
          <common-radio name='radioBtn1' [(ngModel)]='radio1'
                        label='{{radioLabel1}}'></common-radio>

          <common-radio name='radioBtn2' label='{{radioLabel2}}'
                        [radioLabels]='radioButton2'></common-radio>

          <common-radio name='radioBtn3' label='{{radioLabel3}}'
                        [radioLabels]='radioButton3'></common-radio>
          </form>`,
          directives
        );

      fixture.whenStable().then( () => {
        const de1 =  getDebugElement( fixture, 'common-radio', 'radioBtn1' );
        clickValue( de1, false );

        const de2 =  getDebugElement( fixture, 'common-radio', 'radioBtn2' );
        clickValue( de2, 1 );

        const de3 =  getDebugElement( fixture, 'common-radio', 'radioBtn3' );
        clickValue( de3, 'yellow' );

        tickAndDetectChanges( fixture );

        expect( getCheckedValue( de1 ) ).toBe( 'false' );
        clickValue( de1, true );

        expect( getCheckedValue( de2 ) ).toBe( '1' );
        clickValue( de2, 0 );

        expect( getCheckedValue( de3 ) ).toBe( 'yellow' );
        clickValue( de3, 'green' );

        tickAndDetectChanges( fixture );

        expect( getCheckedValue( de1 ) ).toBe( 'true' );
        expect( getCheckedValue( de2 )).toBe( '0' );
        expect( getCheckedValue( de3 ) ).toBe( 'green' );
      });
    }));

    it('should have error required', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
        `<form>
          <common-radio name='radioBtn2' [(ngModel)]='radio2'
                        label='{{radioLabel2}}' required></common-radio>
          </form>`,
          directives
        );

        fixture.whenStable().then( () => {
          const de =  getDebugElement( fixture, 'common-radio', 'radioBtn2' );
          expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
        });
    }));

    it('should not have error required', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
        `<form>
          <common-radio name='radioBtn2' [(ngModel)]='radio2'
                        label='{{radioLabel2}}' required></common-radio>
          </form>`,
          directives
        );

        fixture.whenStable().then( () => {
          const de =  getDebugElement( fixture, 'common-radio', 'radioBtn2' );
          expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();

          clickValue( de, false );
          tickAndDetectChanges( fixture );

          expect( getCheckedValue( de ) ).toBe( 'false' );
          expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeFalsy();
        });
    }));
  });
});


// Helper functions for tests
function clickValue( de: DebugElement, value: any ) {
  const el = de.nativeElement.querySelector( 'input[value=\"' + value + '\"]' );
  if ( el ) {
    el.focus();
    el.click();
  }
}

function getCheckedValue( de: DebugElement ) {
  const el =  de.nativeElement.querySelector( 'input[type=radio]:checked' );
  return el ? el.value : null;
}

function getRadioBtnLabel( de: DebugElement, value: any ) {
  const el = de.nativeElement.querySelector( 'input[value=\"' + value + '\"]' );
  if ( el ) {
    const _label = de.nativeElement.querySelector( ' label[for=\"' + el.id + '\"] ' );
    return _label ? String(_label.textContent).trim() : null;
  }
  return null;
}

