import { fakeAsync } from '@angular/core/testing';
import { DateComponent } from './date.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, OnInit, ViewChildren, QueryList, DebugElement } from '@angular/core';
import {
  tickAndDetectChanges,
  createTestingModule,
  getDebugElement,
  getInputDebugElement,
  setInput,
  getSelectDebugElement,
  setSelect,
  getDebugLegend,
  getDebugInlineError} from '../../../helpers/test-helpers';
import { startOfToday, subDays, addDays, subYears, addYears } from 'date-fns';

@Component({
  template: ``,
})
class DateTestComponent {

  @ViewChildren(DateComponent) dateComponent: QueryList<DateComponent>;

  date1: Date;
  date2: Date = addDays( new Date(), 5 );
  date3: Date = subDays( new Date(), 5 );

  defaultLabel: string = 'Date';
  label2: string = 'New cancellation date for existing attachment (if applicable)';

  today = startOfToday();
  tomorrow = addDays( this.today, 1 );
  startRange = subDays( this.today, 4 );
  endRange = addDays( this.today, 5 );


  defaultInvalidErrorMsg = 'This is a test.';
  errorMessage = {
    invalidRange: this.defaultInvalidErrorMsg
  };

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

// Set date
function setDate( de: DebugElement, dt: Date ) {
  const yearInput = getInputDebugElement( de, de.componentInstance.yearLabelforId );
  const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
  const monthInput = getSelectDebugElement( de, de.componentInstance.monthLabelforId );

  setInput( yearInput, dt.getFullYear() );
  setInput( dayInput, dt.getDate() );
  setSelect( monthInput, dt.getMonth() );
}

const directives: any[] = [ ErrorContainerComponent, DateComponent ];

describe('DateComponent', () => {

  describe('Custom controls - Reactive', () => {
    // TODO: Build reactive form tests

    it('should create', fakeAsync( () => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );
      const component = fixture.componentInstance;
      const de = getDebugElement( fixture, 'common-date', 'date1' );
      tickAndDetectChanges( fixture );
      expect( component.dateComponent ).toBeTruthy();
      expect( getDebugLegend( de ) ).toBe( component.defaultLabel );
    }));

    it('should set control disabled', fakeAsync(() => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date2" formControlName="date2"></common-date>
        </form>`,
        directives,
        true
      );

      const de = getDebugElement( fixture, 'common-date', 'date2' );
      tickAndDetectChanges( fixture );
      expect( de.componentInstance.disabled ).toBeTruthy();
    }));

    it('should set control required', fakeAsync(() => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date3" formControlName="date3"></common-date>
        </form>`,
        directives,
        true
      );

      const de = getDebugElement( fixture, 'common-date', 'date3' );
      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      setInput( dayInput, '' );
      tickAndDetectChanges( fixture );

      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      const errorMessage = getDebugInlineError( de );
      expect( errorMessage ).toContain( 'is required' );
      expect( errorMessage ).not.toContain( 'Invalid' );
    }));

    it('should remove invalidValue error when all fields are reset.', fakeAsync(() => {
      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      const yearInput = getInputDebugElement( de, de.componentInstance.yearLabelforId );
      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      const monthInput = getSelectDebugElement( de, de.componentInstance.monthLabelforId );

      setInput( yearInput, 2020 );
      setInput( dayInput, 2 );
      setSelect( monthInput, 2 );

      tickAndDetectChanges( fixture );

      expect( de.componentInstance._day ).toBe( '2' );
      expect( de.componentInstance._month ).toBe( '2' );
      expect( de.componentInstance._year ).toBe( '2020' );
      expect( de.componentInstance.date ).not.toBeNull();
      expect( de.componentInstance.date ).not.toBeUndefined();

      setInput( yearInput, '' );
      tickAndDetectChanges( fixture );

      expect( de.componentInstance._year ).toBe( '' );
      expect( de.componentInstance.date ).toBeNull();
      expect( de.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeTruthy();

      setInput( dayInput, '' );
      setSelect( monthInput, null );
      tickAndDetectChanges( fixture );

      expect( de.componentInstance._day ).toBe( '' );
      expect( de.componentInstance._month ).toBe( 'null' );
      tickAndDetectChanges( fixture );

      expect( de.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeFalsy();
    }));

    it('should report error invalid date when optional and only month and year are populated', fakeAsync(() => {

      const fixture = createTestingModule( DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      const monthInput = getSelectDebugElement( de, de.componentInstance.monthLabelforId );
      setInput( dayInput, '2' );
      setSelect( monthInput, '4' );
      tickAndDetectChanges( fixture );

      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeTruthy();
      const errorMessage = getDebugInlineError( de );
      // console.log( 'error message: ', errorMessage );
      expect( errorMessage ).toContain( 'Invalid' );

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
      const de = getDebugElement( fixture, 'common-date', 'date1' );
      tickAndDetectChanges( fixture );
      expect( de ).toBeTruthy();
      expect( getDebugLegend( de ) ).toBe( component.defaultLabel );
    }));

    it('should set control disabled', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1" disabled></common-date>
          </form>`,
          directives
        );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      tickAndDetectChanges( fixture );
      expect( de.componentInstance.disabled ).toBeTruthy();
    }));

    it('should set control required', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1" required></common-date>
            </form>`,
            directives
          );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      tickAndDetectChanges( fixture );
      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
    }));

    it('should set control no future date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date2" [(ngModel)]="date2"
                         [dateRangeEnd]='today'></common-date>
            </form>`,
            directives
          );

      const de = getDebugElement( fixture, 'common-date', 'date2' );
      tickAndDetectChanges( fixture );
      expect( de.componentInstance.controlDir.hasError( 'noFutureDatesAllowed' ) ).toBeTruthy();
    }));

    it('should set control no past date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date3" [(ngModel)]="date3"
                         [dateRangeStart]='tomorrow'></common-date>
            </form>`,
            directives
          );

      const de = getDebugElement( fixture, 'common-date', 'date3' );
      tickAndDetectChanges( fixture );
      expect( de.componentInstance.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeTruthy();
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

      const date2 = getDebugElement( fixture, 'common-date', 'date2' );
      const date3 = getDebugElement( fixture, 'common-date', 'date3' );

      setDate( date2, fixture.componentInstance.date2 );
      setDate( date3, fixture.componentInstance.date3 );
      tickAndDetectChanges( fixture );

      expect( date2.componentInstance.controlDir.hasError( 'invalidRange' ) ).toBeFalsy();
      expect( date3.componentInstance.controlDir.hasError( 'invalidRange' ) ).toBeTruthy();
    }));

    it('should set year zero invalid value error', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date1" [(ngModel)]="date1"></common-date>
        </form>`,
        directives
      );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const yearInput = getInputDebugElement( date1, date1.componentInstance.yearLabelforId );
      setInput( yearInput, 0 );
      tickAndDetectChanges( fixture );

      expect( date1.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeTruthy();
    }));

    it('should set clear error when set to null', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date1" [(ngModel)]="date1"></common-date>
        </form>`,
        directives
      );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const yearInput = getInputDebugElement( date1, date1.componentInstance.yearLabelforId );

      setInput( yearInput, 0 );
      tickAndDetectChanges( fixture );

      expect( date1.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeTruthy();

      setInput( yearInput, null );
      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeFalsy();
    }));

    it('should accept past dates when restrictDate=past', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         restrictDate='past'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = subDays( startOfToday(), 1 );

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noFutureDatesAllowed' ) ).toBeFalsy();
    }));

    it('should not accept future dates when restrictDate=past', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         restrictDate='past'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = addDays( startOfToday(), 1 );

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noFutureDatesAllowed' ) ).toBeTruthy();
    }));


    it('should accept today for past date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         [dateRangeEnd]='today'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = startOfToday();

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noFutureDatesAllowed' ) ).toBeFalsy();
    }));

    it('should not accept today for future date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         [dateRangeStart]='tomorrow'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = startOfToday();

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeTruthy();
    }));

    it('should accept tomorrow for future date', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         [dateRangeStart]='tomorrow'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = addDays( startOfToday(), 1 );

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeFalsy();
    }));

    it('should accept future dates when restrictDate=future', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         restrictDate='future'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = addDays( startOfToday(), 2 );

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeFalsy();
    }));

    it('should not accept past dates when restrictDate=future', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"
                         restrictDate='future'></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = startOfToday();

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'noPastDatesAllowed' ) ).toBeTruthy();
    }));

    it('should accept past dates 150 years ago', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = subYears(startOfToday(), 150);

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'yearDistantPast' ) ).toBeFalsy();
    }));

    it('should not accept past dates more than 150 years ago', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = subYears(subDays( startOfToday(), 1 ), 150);

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'yearDistantPast' ) ).toBeTruthy();
    }));

    it('should accept future dates 150 years in future', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = addYears(startOfToday(), 150);

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'yearDistantFuture' ) ).toBeFalsy();
    }));

    it('should not accept future dates more than 150 years in future', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1"></common-date>
            </form>`,
            directives
          );

      const date1 = getDebugElement( fixture, 'common-date', 'date1' );
      const dt = addYears(addDays( startOfToday(), 1 ), 150);

      setDate( date1,  dt );

      tickAndDetectChanges( fixture );
      expect( date1.componentInstance.controlDir.hasError( 'yearDistantFuture' ) ).toBeTruthy();
    }));

    it('should display difference error message for invalid range', fakeAsync(() => {

      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date2" [(ngModel)]="date2"
                        [dateRangeStart]='startRange'
                        [dateRangeEnd]='endRange'
                        [errorMessage]='errorMessage'></common-date>
          </form>`,
          directives
        );

      tickAndDetectChanges( fixture );

      const date2 = getDebugElement( fixture, 'common-date', 'date2' );
      const dt = subDays( startOfToday(), 10);
      setDate( date2,  dt );

      tickAndDetectChanges( fixture );

      expect( date2.componentInstance.controlDir.hasError( 'invalidRange' ) ).toBeTruthy();

      let errorMsg = getDebugInlineError( date2 );
      expect( errorMsg ).toContain( fixture.componentInstance.defaultInvalidErrorMsg );
      fixture.componentInstance.errorMessage = {invalidRange: 'This is a different test message.'};

      tickAndDetectChanges( fixture );
      errorMsg = getDebugInlineError( date2 );
      expect( errorMsg ).toContain( 'This is a different test message.' );
    }));

    it('should allow more than 150 in the future when endRange set', fakeAsync(() => {

      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date2" [(ngModel)]="date2"
                        [dateRangeStart]='startRange'
                        [dateRangeEnd]='endRange'
                        [errorMessage]='errorMessage'></common-date>
          </form>`,
          directives
        );

      fixture.componentInstance.endRange = addYears( fixture.componentInstance.today, 160 );

      tickAndDetectChanges( fixture );

      const date2 = getDebugElement( fixture, 'common-date', 'date2' );
      const dt = addYears( startOfToday(), 155 );
      setDate( date2,  dt );

      tickAndDetectChanges( fixture );

      expect( date2.componentInstance.controlDir.hasError( 'yearDistantFuture' ) ).toBeFalsy();
      expect( date2.componentInstance.controlDir.errors ).toBeNull();
    }));

    it('should allow more than 150 in the past when startRange set', fakeAsync(() => {

      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date2" [(ngModel)]="date2"
                        [dateRangeStart]='startRange'
                        [dateRangeEnd]='endRange'
                        [errorMessage]='errorMessage'></common-date>
          </form>`,
          directives
        );

      fixture.componentInstance.startRange = subYears( fixture.componentInstance.today, 160 );

      tickAndDetectChanges( fixture );

      const date2 = getDebugElement( fixture, 'common-date', 'date2' );
      const dt = subYears( startOfToday(), 155 );
      setDate( date2,  dt );

      tickAndDetectChanges( fixture );

      expect( date2.componentInstance.controlDir.hasError( 'yearDistantPast' ) ).toBeFalsy();
      expect( date2.componentInstance.controlDir.errors ).toBeNull();
    }));

    it('should report error invalid date when optional and only day and year are populated', fakeAsync(() => {

      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date1" [(ngModel)]="date1"></common-date>
          </form>`,
          directives
        );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      const yearInput = getInputDebugElement( de, de.componentInstance.yearLabelforId );
      setInput( dayInput, 2 );
      setInput( yearInput, 2019 );
      tickAndDetectChanges( fixture );

      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'invalidValue' ) ).toBeTruthy();

    }));

    it('should report error required when mandatory and only day and year are populated', fakeAsync(() => {

      const fixture = createTestingModule( DateTestComponent,
        `<form>
          <common-date name="date1" [(ngModel)]="date1" required></common-date>
          </form>`,
          directives
        );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      const monthInput = getSelectDebugElement( de, de.componentInstance.monthLabelforId );
      const yearInput = getInputDebugElement( de, de.componentInstance.yearLabelforId );
      setInput( dayInput, 2 );
      setInput( yearInput, 2020 );

      tickAndDetectChanges( fixture );

      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();

      setSelect( monthInput, '4' );
      tickAndDetectChanges( fixture );

     // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeFalsy();

      setInput( yearInput, null );
      tickAndDetectChanges( fixture );

      // console.log( 'errors: ', de.componentInstance.controlDir.errors );
      expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();
      const errorMessage = getDebugInlineError( de );
      expect( errorMessage ).toContain( 'is required' );
      expect( errorMessage ).not.toContain( 'Invalid' );
    }));

    it('should strip information inside brackets from label', fakeAsync(() => {
      const fixture = createTestingModule( DateTestComponent,
          `<form>
            <common-date name="date1" [(ngModel)]="date1" [label]="label2" required></common-date>
            </form>`,
            directives
          );

      const de = getDebugElement( fixture, 'common-date', 'date1' );
      const label = getDebugLegend( de );

      tickAndDetectChanges( fixture );
      // console.log( 'label: ', label );
      expect( label  ).toContain( fixture.componentInstance.label2 );

      const dayInput = getInputDebugElement( de, de.componentInstance.dayLabelforId );
      const monthInput = getSelectDebugElement( de, de.componentInstance.monthLabelforId );
      const yearInput = getInputDebugElement( de, de.componentInstance.yearLabelforId );
      setInput( dayInput, 2 );
      setInput( yearInput, 2020 );
      tickAndDetectChanges( fixture );

      fixture.whenStable().then( () => {

        // console.log( 'errors: ', de.componentInstance.controlDir.errors );
        expect( de.componentInstance.controlDir.hasError( 'required' ) ).toBeTruthy();

        const errorMessage = getDebugInlineError( de );
        // console.log( 'error message: ', errorMessage );
        expect( errorMessage ).not.toContain( '(if applicable)' );
      });

    }));


    it('should not error skip a month when submitting on a 31st day.', fakeAsync(() => {
      jasmine.clock().mockDate(new Date(2020, 0, 31));

      const fixture = createTestingModule(DateReactTestComponent,
        `<form [formGroup]="form">
          <common-date name="date1" formControlName="date1"></common-date>
        </form>`,
        directives,
        true
      );
      const component = fixture.componentInstance;
      const de = getDebugElement(fixture, 'common-date', 'date1');
      tickAndDetectChanges(fixture);
      
      const dayInput = getInputDebugElement(de, de.componentInstance.dayLabelforId);
      const yearInput = getInputDebugElement(de, de.componentInstance.yearLabelforId);
      const monthInput = getSelectDebugElement(de, de.componentInstance.monthLabelforId);

      setSelect(monthInput, 3);
      setInput(dayInput, 3);
      setInput(yearInput, 2020);
      
      expect(component.form.controls.date1.value.getMonth()).toEqual(3);
    }));
  });
});
