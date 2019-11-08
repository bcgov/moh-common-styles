import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import {FormsModule, NgForm, FormGroup, FormBuilder} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {PhnComponent} from './phn.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { RadioComponent } from '../radio/radio.component';
import { createTestingModule, tickAndDetectChanges, getLegendContext } from '../../../helpers/test-helpers';

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

  });

  describe('Custom controls - Template', () => {

  });



  /*
  let component: PhnComponent;
  let fixture: ComponentFixture<PhnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhnComponent ],
      imports: [
        FormsModule,
        TextMaskModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});


function getElement( fixture: ComponentFixture<any>, name: string ) {
  const selector = 'common-phn[name=' + name + '] input';
  return fixture.nativeElement.querySelector( selector );
}

function getLabel( fixture: ComponentFixture<any>, name: string ) {
  const selector = 'common-phn label[for=' + name + '] ';
  return fixture.nativeElement.querySelector( selector );
}
