import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { Type, ViewChild, Component, DebugElement } from '@angular/core';
import { SharedCoreModule } from '../../shared-core.module';
import { SinComponent } from './sin.component';
import { By } from '@angular/platform-browser';

/**
 * TODO: Complete tests - using ng-select (github) tests as guide for writing these tests
 */

describe('SinComponent', () => {

  it('should create', fakeAsync(() => {
    const fixture = createTestingModule(
      CommonSinTestComponent,
      `<common-sin name='sin' [(ngModel)]="value"></common-sin>`
      );

    tickAndDetectChanges( fixture );
    expect( fixture.componentInstance ).toBeTruthy();
  }));

  it('should be disabled', fakeAsync(() => {
    const fixture = createTestingModule(
      CommonSinTestComponent,
      `<common-sin name='sin' [(ngModel)]="value" disabled></common-sin>`
      );

    tickAndDetectChanges( fixture );
    expect(fixture.componentInstance.input.controlDir.disabled).toBe(true);
  }));

  it('should be set sin value', fakeAsync(() => {
    const fixture = createTestingModule(
      CommonSinTestComponent,
      `<common-sin name='sin' [(ngModel)]="value"></common-sin>`
      );

    tickAndDetectChanges( fixture );
    fixture.componentInstance.value = '041771651';
    tickAndDetectChanges( fixture );
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.input.sin).toBe( '041771651' );
    });
  }));
});

function createTestingModule<T>( cmp: Type<T>, template: string ): ComponentFixture<T> {
  TestBed.configureTestingModule({
      imports: [
        SharedCoreModule,
        FormsModule,
        TextMaskModule
      ],
      declarations: [cmp]
  })
      .overrideComponent(cmp, {
          set: {
              template: template
          }
      })
      .compileComponents();

  const fixture = TestBed.createComponent( cmp );
  fixture.detectChanges();
  return fixture;
}

@Component({
  template: ``
})
class CommonSinTestComponent {
   @ViewChild( SinComponent ) input: SinComponent;

  value: string = '';
}


function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
}


function triggerKeyDownEvent(element: DebugElement, which: number, key = ''): void {
  element.triggerEventHandler('keydown', {
      which: which,
      key: key,
      preventDefault: () => { },
  });
}


function getElement(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query( By.css('common-sin') );
}

