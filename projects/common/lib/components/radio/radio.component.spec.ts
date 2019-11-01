import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import {FormsModule, NgForm, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RadioComponent } from './radio.component';
import { QueryList, Component, ViewChildren, OnInit, Type } from '@angular/core';
import { tickAndDetectChanges } from '../../../helpers/test-helpers';
import { ErrorContainerComponent } from '../error-container/error-container.component';

/*
describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Radio label is displayed', () => {
    component.label = 'Radio';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Radio');
    });
  });*/

  /*it('Radio Button clicked', () => {
    component.checked = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.checked).toEqual(true);
    });
  });*/

  /*
  it ('Radio Disabled set to true', () => {
    component.disabled = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.disabled).toBeTruthy();
    });
  });
});*/


@Component({
  template: ``,
})
class RadioTestComponent {

  @ViewChildren(RadioComponent) radioComponent: QueryList<RadioComponent>;
  radio1: boolean;
  radio2: boolean;

  radioLabel1: string = 'Where you born in Canada?';
  radioLabel2: string = 'Where you born in Europe?';

  radioBtnLabel: string[] = [ 'No', 'Yes' ];

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

    xit('should create', fakeAsync(() => {
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
      expect( fixture.nativeElement.querySelector('legend').textContent ).toBe( component.radioLabel1);
      expect( component.form.get('radioBtn1').hasError( 'required' )  ).toBeFalsy();
    }));
  });

  describe('Custom controls - Template', () => {

    xit('should create', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
          `<common-radio [(ngModel)]='radio1' label='{{radioLabel1}}'></common-radio>`
          );
      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );

      expect( component.radioComponent ).toBeTruthy();
      expect( fixture.nativeElement.querySelector('legend').textContent ).toBe( component.radioLabel1 );
      expect( component.radioComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

    it('should set radio true', fakeAsync(() => {
      const fixture = createTestingModule( RadioTestComponent,
          `<form>
            <common-radio name='radioBtn1' [(ngModel)]='radio1' label='{{radioLabel1}}'></common-radio>
           </form>`
          );
      const component = fixture.componentInstance;
      component.radio1 = true;
      tickAndDetectChanges( fixture );

      const radio = fixture.nativeElement.querySelectorAll('input[type=radio]');
      radio.forEach(element => {
        console.log( element.value + ' (checked): ', element.checked );
      });

      const radioChecked = fixture.nativeElement.querySelector('input[type=radio]:checked');
      expect( radioChecked ).toBeTruthy();
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
      providers: [ NgForm ]
    }).overrideComponent(cmp, {
          set: {
              template: template
          }
      });

  TestBed.compileComponents();

  const fixture = TestBed.createComponent(cmp);
  fixture.detectChanges();
  return fixture;
}
