import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';  
import { NameComponent } from './name.component';
import {Person} from '../../../models/src/person.model';

describe('NameComponent', () => {
  let component: NameComponent;
  let fixture: ComponentFixture<NameComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm, Person ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    this.person = new Person;
    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('FirstName label is displayed', () => {
    component.firstNamelabel = 'First Name';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('firstNamelabel').textContent).toEqual('First Name');
    });
  });

  it ('LastName label is displayed', () => {
    component.lastNamelabel = 'Last Name';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('lastNamelabel').textContent).toEqual('Last Name');
    });
  });

  it ('First Name value Input by the User', () => {
    component.firstName = 'Mark';
    
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type=text]').value).toEqual('Mark');
    });
  });
 


});
