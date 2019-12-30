import { fakeAsync } from '@angular/core/testing';
import { DateComponent } from './date.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, ViewChild, OnInit, ViewChildren, QueryList } from '@angular/core';
import { tickAndDetectChanges, createTestingModule, getLegendContext } from '../../../helpers/test-helpers';
import { startOfToday, subDays, addDays } from 'date-fns';

@Component({
  template: ``,
})
class DateTestComponent {

  @ViewChildren(DateComponent) dateComponent: QueryList<DateComponent>;

  date1: Date;
  date2: Date = addDays( new Date(), 5 );
  date3: Date = subDays( new Date(), 5 );

  defaultLabel: string = 'Date';

  today = startOfToday();
  yesterday = subDays(this.today, 1 );
  startRange = addDays( this.today, 4 );
  startEnd = subDays( this.today, 5 );

  constructor() {}
}

@Component({
  template: ``,
})
class DateReactTestComponent extends DateTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      date1: [ this.date1 ],
      date2: [ {value: this.date2, disabled: true } ],
      date3: [ this.date3, Validators.required ]
    });
  }
}

const directives: any[] = [ ErrorContainerComponent, DateComponent ];

describe('DateComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync( () => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );
      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.dateComponent ).toBeTruthy();
      expect( getLegendContext( fixture, 'common-date', 'date1') ).toBe( component.defaultLabel );
    }));

    it('should remove invalidValue error when all fields are reset.', fakeAsync(() => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );
      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.dateComponent ).toBeTruthy();
      //expect( getLegendContext( fixture, 'common-date', 'date1') ).toBe( component.defaultLabel );
      component.dateComponent.first.onBlurDay('2');
      component.dateComponent.first.onBlurMonth('2');
      component.dateComponent.first.onBlurYear('2020');
      tickAndDetectChanges( fixture );
      expect(component.dateComponent.first._day).toBe('2');
      expect(component.dateComponent.first._month).toBe('2');
      expect(component.dateComponent.first._year).toBe('2020');
      expect(component.dateComponent.first.date).not.toBe(undefined);
      expect(component.dateComponent.first.date).not.toBe(null);
      component.dateComponent.first.onBlurYear('');
      expect(component.dateComponent.first._year).toBe('');
      expect(component.dateComponent.first.date).toBe(null);
      expect(component.dateComponent.first.controlDir.errors.invalidValue).toEqual(true);
      component.dateComponent.first.onBlurMonth('null');
      component.dateComponent.first.onBlurDay('');
      expect(component.dateComponent.first.controlDir.errors).toEqual(null);
    }));
  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"></common-date>
          </form>`,
          directives
        );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      expect( component.dateComponent ).toBeTruthy();
      expect( getLegendContext( fixture, 'common-date', 'date1') ).toBe( component.defaultLabel );
    }));

    it('should set control disabled', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1" disabled></common-date>
          </form>`,
          directives
          );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.dateComponent.first.disabled ).toBeTruthy();
    }));

    it('should set control required', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1" required></common-date>
            </form>`,
            directives
          );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.dateComponent.first.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    it('should set control no future date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date2" [(ngModel)]="date2"
                         [dateRangeEnd]='yesterday'></common-date>
            </form>`,
            directives
          );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.dateComponent.first.controlDir.hasError( 'noFutureDatesAllowed' ) ).toBeTruthy();
    }));

    it('should set control no past date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date3" [(ngModel)]="date3"
                         [dateRangeStart]='today'></common-date>
            </form>`,
            directives
          );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.dateComponent.first.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeTruthy();
    }));

    it('should set control outside range (2 date components)', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date2" [(ngModel)]="date2"
                         [dateRangeStart]='startRange'
                         [dateRangeEnd]='endRange'></common-date>
            <common-date name="date3" [(ngModel)]="date3"
                         [dateRangeStart]='startRange'
                         [dateRangeEnd]='endRange'></common-date>
            </form>`,
            directives
          );

      tickAndDetectChanges( fixture );
      expect( fixture.componentInstance.dateComponent.first.controlDir.hasError( 'invalidRange' ) ).toBeFalsy();
      expect( fixture.componentInstance.dateComponent.last.controlDir.hasError( 'invalidRange' ) ).toBeTruthy();
    }));

    xit('should set year zero invalid value error', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date1" [(ngModel)]="date1"></common-date>
        </form>`,
        directives
      );

    }));
  });
});


/*
describe('DateComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;
  let elmt: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorContainerComponent,
        DateComponent
      ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
})*/

/*
describe('DateComponent (using current date)', () => {
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
