import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';
import { FullNameComponent } from './full-name.component';
import {Person} from '../../../models/src/person.model';

describe('NameComponent', () => {
  let component: FullNameComponent;
  let fixture: ComponentFixture<FullNameComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullNameComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm, Person ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    this.person = new Person;
    fixture = TestBed.createComponent(FullNameComponent);
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
