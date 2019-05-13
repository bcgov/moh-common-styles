import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';  
import { CheckboxComponent } from './checkbox.component';



describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let el;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Label is displayed', () => {
    component.label = 'Checkbox';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Checkbox');
    });
  });

  it ('Checkbox is checked', () => {
    component.model = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('input[type=checkbox]').checked).toEqual(true);
    });
  });

});
