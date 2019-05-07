import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonGroupComponent } from './button-group.component';
import {FormsModule, NgForm} from '@angular/forms';

describe('ButtonGroupComponent', () => {
  let component: ButtonGroupComponent;
  let fixture: ComponentFixture<ButtonGroupComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonGroupComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonGroupComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Input label is displayed', () => {
    component.label = 'Default Checkbox';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Default Checkbox');
    });
  });

  it ('Required set to false (not required)', () => {
    component.required = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type="button"]').hasAttribute('required')).toBeFalsy();
    });
  });

  it ('Disabled set to true', () => {
    component.disabled = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type="button"]').hasAttribute('disabled')).toBeTruthy();
    });
  });

  it ('Selected or clicked Yes ', () => {
    component.data = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type="button"]').value).toEqual(true);
    });
  });

  it ('Selected or clicked No ', () => {
    component.data = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type="button"]').value).toEqual(false);
    });
  });

});
