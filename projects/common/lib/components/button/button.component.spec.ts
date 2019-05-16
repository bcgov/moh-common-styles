import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import {FormsModule, NgForm} from '@angular/forms'; 

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Button label is displayed', () => {
    component.label = 'Button';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('label').textContent).toEqual('Button');
    });
  });

  it('Button is clicked', () => {
    spyOn(component, 'onClick');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.onClick).toHaveBeenCalled();
    });
  });

});
