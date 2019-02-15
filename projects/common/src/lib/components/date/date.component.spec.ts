import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { DateComponent } from './date.component';
import { DateFieldFormatDirective } from './date-field-format.directive';
import { YearValidateDirective } from './year-validate.directive';
import { DayValidationDirective } from './day-validation.directive';
import { FormsModule, NgForm } from '@angular/forms';
import * as moment from 'moment';

fdescribe('DateComponent (not using current date)', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;
  const form = new NgForm( null, null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateComponent,
        DateFieldFormatDirective,
        YearValidateDirective,
        DayValidationDirective
      ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    component.date = { month: null, day: null, year: null };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be required by default', () => {
    expect(component.required).toBe(true);
  });

  it('should be not use current date by default', () => {
    expect(component.useCurrentDate).toBe(false);
  });

  it('should be enabled by default', () => {
    expect(component.disabled).toBe(false);
  });

  it('should allow any dates range by default', () => {
    expect(component.restrictDate).toBe('any');
  });

  it('should display text  label for component', () => {
    component.label = 'This a test';
    fixture.detectChanges();

    const legendText = fixture.nativeElement.querySelector('legend');
    expect( legendText.textContent).toContain('This a test');
  });

  it('should detect incomplete dates', () => {
    fixture.whenStable().then( () => {
      expect(component.monthRef.errors.required).toBe(true);
      expect(component.dayRef.errors.required).toBe(true);
      expect(component.yearRef.errors.required).toBe(true);
    });
  });

  it('should allow incomplete dates when optional', () => {
    component.required = false;
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.monthRef.errors).toBeNull();
      expect(component.dayRef.errors).toBeNull();
      expect(component.yearRef.errors).toBeNull();
    });
  });
});

fdescribe('DateComponent (using current date)', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;
  const form = new NgForm( null, null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateComponent,
        DateFieldFormatDirective,
        YearValidateDirective,
        DayValidationDirective
      ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    component.date = { month: null, day: null, year: null };
    component.useCurrentDate = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current date', () => {
    const todayDate = {month: moment().month(), day: moment().date(), year: moment().year()};
    expect(component.date.month).toEqual(todayDate.month);
    expect(component.date.day).toEqual(todayDate.day);
    expect(component.date.year).toEqual(todayDate.year);
  });

  it('should reject todays date when restricted to past dates', () => {
    component.restrictDate = 'past';
    fixture.detectChanges();
    fixture.whenStable().then(()  => {
      expect(component.yearRef.errors.noFutureDatesAllowed).toBe(true);
    });
  });

  it('should accept todays date when restricted to future dates', () => {
    component.restrictDate = 'future';
    fixture.detectChanges();
    fixture.whenStable().then(()  => {
      expect(component.yearRef.errors).toBeNull();
    });
  });

  it('should reject past dates when restricted to future dates', () => {
    component.restrictDate = 'future';
    component.date.year -= 1;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.yearRef.errors.noPastDatesAllowed).toBe(true);
    });
  });

  it('should reject dates when too far in the past', () => {
    component.date.year -= 151;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.yearRef.errors.yearDistantPast).toBe(true);
    });
  });

  it('should reject dates when too far in the future', () => {
    component.date.year += 151;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.yearRef.errors.yearDistantFuture).toBe(true);
    });
  });

  it('should reject dates when day is out of range', () => {
    component.date.day = 40;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.dayRef.errors.dayOutOfRange).toBe(true);
    });
  });
});
// TODO: Figure out why when more than one test controls do not get created on
//       first test...
xdescribe('DateComponent (Trigger validations)', () => {
    let component: DateComponent;
    let fixture: ComponentFixture<DateComponent>;
    let form: NgForm;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DateComponent,
          DateFieldFormatDirective,
          YearValidateDirective,
          DayValidationDirective
        ],
        imports: [ FormsModule ],
        providers: [ NgForm ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      form = new NgForm( null, null);
      fixture = TestBed.createComponent(DateComponent);
      component = fixture.componentInstance;
    });

    it('should trigger day validation when month changes', () => {
      component.date = { month: 1, day: 30, year: 1999 };
      fixture.detectChanges();
      expect(component.dayRef.errors).toBeNull();

      component.setMonth('2');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        setTimeout( () => {
          console.log( '1b. dayRef.errors: ', component.dayRef.errors );
          expect(component.dayRef.errors.dayOutOfRange).toBe(true);
        }, 30);
      });
    });

    it('should trigger day validation when year changes', () => {

      component.date = { month: 2, day: 29, year: 2000 };
      fixture.detectChanges();
      expect(component.dayRef.errors).toBeNull();

      component.setYear('2001');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        setTimeout( () => {
          console.log( '2. dayRef.errors: ', component.dayRef.errors );
          expect(component.dayRef.errors.dayOutOfRange).toBe(true);
        }, 30);
      });
    });
  });


/**
  xit('should detect incomplete dates', () => {
    expect(component.isValid()).toBe(false);
    component.setDayValueOnModel('1');
    fixture.detectChanges();
    component.setMonthValueOnModel('1');
    expect(component.isValid()).toBe(false);
  });

  xit('should pass validation when completely empty if not required', () => {
    component.required = false;
    expect(component.isValid()).toBe(true);
    component.setDayValueOnModel('1');
    expect(component.isValid()).toBe(false);
  });


  xit('should accept future dates when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    component.setYearValueOnModel(component.date.year + 1 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });

  }));

  xit('should reject past dates when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    component.setYearValueOnModel(component.date.year - 10 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(false);
    });

  }));



  xit('should accept past dates when restricted to past dates.', async(() => {
    component.restrictDate = 'past';
    component.setToToday();
    component.setYearValueOnModel(component.date.year - 10 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });
  }));


  xit('should accept todays date when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });
  }));

  xit('should reject todays date when restricted to past dates', async(() => {
    component.restrictDate = 'past';
    component.setToToday();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(false);
    });
  }));

  xit('should display text for component', () => {
    component.label = 'This a test';
    fixture.detectChanges();

    const legendText = fixture.nativeElement.querySelector('legend');
    expect( legendText.textContent).toContain('This a test');
  });

});
 */
