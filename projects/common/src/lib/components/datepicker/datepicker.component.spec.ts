import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';
import {NgxMyDatePickerModule} from 'ngx-mydatepicker';
import {FormsModule} from '@angular/forms';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;
  let today: Date;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerComponent ],
      imports: [NgxMyDatePickerModule.forRoot(), FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    today = new Date();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle being created without a date', () => {
    expect(component).toBeTruthy();
    expect(component.date).toBeUndefined();
  });

  it('should handle being created with a date', () => {
    component.date = today;
    expect(component.date).toBeDefined();
    expect(component.date).toEqual(today); //Check strict identity, not just equivalence
  });

  it('should be able to clear date', () => {
    fixture.detectChanges();
    component.date = today;
    expect(component.date).toEqual(today);
    component.clearDate();
    expect(component.date).toBeNull('should be null after clearing');
  });

  it('should propertly detect a valid date', () => {
    component.date = today;
    expect(component.hasValidDate).toBe(true, 'should be valid when date is set to today');
  });

  it('should not have a valid date when date is null', () => {
    expect(component.hasValidDate).toBe(false, 'no date is set so valid date should be false.');
  });

  xit('should format the date correctly', () => {
    const y2k = new Date('January 1 2000');
    component.date = y2k;
    fixture.detectChanges();
    expect(component.model.date).toBe('01/01/2000');
  });
});
