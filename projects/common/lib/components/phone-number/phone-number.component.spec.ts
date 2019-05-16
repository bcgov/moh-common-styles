import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm} from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { PhoneNumberComponent } from './phone-number.component';

describe('PhoneNumberComponent', () => {
  let component: PhoneNumberComponent;
  let fixture: ComponentFixture<PhoneNumberComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneNumberComponent ],
      imports: [ FormsModule, TextMaskModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it ('Phone number label is displayed', () => {
    component.label = 'Mobile';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Mobile');
    });
  });

  it ('Phone number value Input by the User', () => {
    component.phoneNumber = '2355555252';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type=text]').value).toEqual('+1 (235) 555-5252');
    });
  });



});
