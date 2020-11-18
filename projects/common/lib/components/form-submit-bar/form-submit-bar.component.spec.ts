import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSubmitBarComponent } from './form-submit-bar.component';

describe('FormActionBarComponent', () => {
  let component: FormSubmitBarComponent;
  let fixture: ComponentFixture<FormSubmitBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSubmitBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubmitBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
