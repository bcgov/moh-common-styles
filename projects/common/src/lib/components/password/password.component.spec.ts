import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordComponent } from './password.component';
import {FormsModule, NgForm} from '@angular/forms';

fdescribe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Input label is displayed', () => {
    component.componentLabel = 'Password';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Password ');
    });
  });

  it ('Input isRequired set to false (not required)', () => {
    component.isRequired = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input').hasAttribute('required')).toBeFalsy();
    });
  });

  it ('Input isDisabled set to true (input is disabled)', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input').hasAttribute('disabled')).toBeTruthy();
    });
  });

  it ('Input password appears in input box', () => {
    component.password = 'BooWhoo@blah1';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input').value).toEqual('BooWhoo@blah1');
    });
  });
});
