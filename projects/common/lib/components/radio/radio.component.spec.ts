import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';  
import { RadioComponent } from './radio.component';

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
  });

  it('Radio Button clicked', () => {
    component.checked = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.checked).toEqual(true);
    });
  });

  it ('Radio Disabled set to true', () => {
    component.disabled = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.disabled).toBeTruthy();
    });
  });


});
