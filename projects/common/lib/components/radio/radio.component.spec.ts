import { ComponentFixture, TestBed, fakeAsync, ComponentFixtureAutoDetect } from '@angular/core/testing';
import {FormsModule, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RadioComponent } from './radio.component';
import { QueryList, Component, ViewChildren, OnInit, Type } from '@angular/core';
import { tickAndDetectChanges, getLegendContext } from '../../../helpers/test-helpers';
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

describe('RadioComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
          `<form [formGroup]="form">
            <common-radio name='radioBtn1' label='{{radioLabel1}}'
                          formControlName='radioBtn1'></common-radio>
          </form>`,
          true
          );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.radioComponent ).toBeTruthy();
      expect( getLegendContext( fixture ) ).toBe( component.radioLabel1);
      expect( component.form.get('radioBtn1').hasError( 'required' )  ).toBeFalsy();
    }));

    it('should toggle radio button from true to false', fakeAsync(() => {
      const fixture = createTestingModule( RadioReactTestComponent,
        `<form [formGroup]="form">
          <common-radio name='radioBtn1' label='{{radioLabel1}}'
                        formControlName='radioBtn1'></common-radio>
        </form>`,
        true
      );

      const component = fixture.componentInstance;

      component.form.get( 'radioBtn1' ).setValue( true );
      tickAndDetectChanges( fixture );

      let radioChecked = getCheckedElement( fixture );
      expect( radioChecked.value ).toBe( 'true' );

      component.form.get( 'radioBtn1' ).setValue( false );
      tickAndDetectChanges( fixture );

      radioChecked = getCheckedElement( fixture );
      expect( radioChecked.value ).toBe( 'false' );
    }));
  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
          `<form>
            <common-radio name='radioBtn1' [(ngModel)]='radio1'
                          label='{{radioLabel1}}'></common-radio>
           </form>`
          );
      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );

      expect( component.radioComponent ).toBeTruthy();
      expect( getLegendContext( fixture ) ).toBe( component.radioLabel1 );
      expect( component.radioComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should toggle radio button from true to false', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
          `<form>
            <common-radio name='radioBtn1' [(ngModel)]='radio1'
                          label='{{radioLabel1}}'></common-radio>
           </form>`
          );

      let radio = fixture.nativeElement.querySelector( 'common-radio[name=radioBtn1] input[value=true]' );

      radio.click();
      tickAndDetectChanges( fixture );

      let radioChecked = getCheckedElement( fixture );
      expect( radioChecked.value ).toBe( 'true' );

      radio = fixture.nativeElement.querySelector( 'common-radio[name=radioBtn1] input[value=false]' );
      radio.click();
      tickAndDetectChanges( fixture );

      radioChecked = getCheckedElement( fixture );
      expect( radioChecked.value ).toBe( 'false' );
    }));
  });
});


function createTestingModule<T>(cmp: Type<T>, template: string, reactForm: boolean = false): ComponentFixture<T> {

  const importComp: any = [ FormsModule ];
  if ( reactForm ) {
    importComp.push( ReactiveFormsModule );
  }

  TestBed.configureTestingModule({
      declarations: [
        cmp,
        ErrorContainerComponent,
        RadioComponent
      ],
      imports: [
        importComp
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).overrideComponent(cmp, {
          set: {
              template: template
          }
      });

  TestBed.compileComponents();

  const fixture = TestBed.createComponent(cmp);
  // fixture.detectChanges();
  return fixture;
}

function getCheckedElement( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector( 'input[type=radio]:checked' );
}

