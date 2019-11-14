import { ComponentFixture, TestBed, fakeAsync, ComponentFixtureAutoDetect, async } from '@angular/core/testing';
import {FormsModule, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RadioComponent } from './radio.component';
import { QueryList, Component, ViewChildren, OnInit } from '@angular/core';
import { tickAndDetectChanges, getLegendContext, createTestingModule } from '../../../helpers/test-helpers';
import { ErrorContainerComponent } from '../error-container/error-container.component';


@Component({
  template: ``,
})
class RadioTestComponent {

  @ViewChildren(RadioComponent) radioComponent: QueryList<RadioComponent>;
  radio1: boolean;
  radio2: boolean;

  radioLabel1: string = 'Where you born in Canada?';
  radioLabel2: string = 'Where you born in Europe?';

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
      radioBtn1: [ this.radio1 ],
      radioBtn2: [ this.radio2 ]
    });
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

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.radioComponent ).toBeTruthy();
      expect( getLegendContext( fixture , 'common-radio', 'radioBtn1') ).toBe( component.radioLabel1);
      expect( component.form.get('radioBtn1').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should toggle radio button from true to false', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
          <common-radio name='radioBtn1' label='{{radioLabel1}}'
                        formControlName='radioBtn1'></common-radio>
        </form>`,
        directives,
        true
      );
      fixture.whenStable().then( () => {
        const component = fixture.componentInstance;
        let radio = getRadioElment( fixture, 'radioBtn1', true );

        radio.click();
        tickAndDetectChanges( fixture );
        let radioChecked = getCheckedElement( fixture );
        expect( radioChecked.value ).toBe( 'true' );
        expect( component.form.get( 'radioBtn1' ).value ).toBeTruthy();

        radio = getRadioElment( fixture, 'radioBtn1', false );
        radio.click();
        tickAndDetectChanges( fixture );
        radioChecked = getCheckedElement( fixture );
        expect( radioChecked.value ).toBe( 'false' );
        expect( component.form.get( 'radioBtn1' ).value ).toBeFalsy();
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
      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.radioComponent ).toBeTruthy();
      expect( getLegendContext( fixture, 'common-radio', 'radioBtn1' ) ).toBe( component.radioLabel1 );
      expect( component.radioComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should toggle radio button from true to false (ngModel)', fakeAsync( () => {
      const fixture = createTestingModule( RadioTestComponent,
        `<form>
          <common-radio name='radioBtn1' [(ngModel)]='radio1'
                        label='{{radioLabel1}}'></common-radio>
          </form>`,
          directives
        );

      fixture.whenStable().then( () => {

        const component = fixture.componentInstance;
        let radio = getRadioElment( fixture, 'radioBtn1', true );

        radio.click();
        tickAndDetectChanges( fixture );
        let radioChecked = getCheckedElement( fixture );
        expect( radioChecked.value ).toBe( 'true' );
        expect( component.radio1 ).toBeTruthy();

        radio = getRadioElment( fixture, 'radioBtn1', false );
        radio.click();
        tickAndDetectChanges( fixture );
        radioChecked = getCheckedElement( fixture );
        expect( radioChecked.value ).toBe( 'false' );
        expect( component.radio1 ).toBeFalsy();
      });
    }));
  });
});

function getCheckedElement( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector( 'input[type=radio]:checked' );
}

function getRadioElment( fixture: ComponentFixture<any>, name: string, value: any ) {
  const selector = 'common-radio[name=' + name + '] input[value=' + value + ']';
  return fixture.nativeElement.querySelector( selector );
}

