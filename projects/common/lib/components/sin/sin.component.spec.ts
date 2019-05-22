import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { Type, ViewChild, Component, DebugElement } from '@angular/core';
import { SharedCoreModule } from '../../shared-core.module';
import { SinComponent } from './sin.component';
import { KeyCode } from '@ng-select/ng-select/ng-select/ng-select.types';
import { By } from 'selenium-webdriver';

fdescribe('SinComponent', () => {

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
    expect(fixture.componentInstance.inputSin.controlDir.disabled).toBe(true);
  }));

  it('should be invalid with pattern error', fakeAsync(() => {
    const fixture = createTestingModule(
      CommonSinTestComponent,
      `<common-sin name='sin' [(ngModel)]="value" required></common-sin>`
      );

   // fixture.nativeElement.ngModel = '041771651';

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.value).toBe( '041771651' );
     // expect(fixture.componentInstance.inputSin.controlDir.invalid).toBe(true);
     // expect(fixture.componentInstance.inputSin.controlDir.hasError('pattern')).toBe(true);
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
   @ViewChild( SinComponent ) inputSin: SinComponent;

  value: string = '';
}


function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
}


export function triggerKeyDownEvent(element: DebugElement, which: number, key = ''): void {
  element.triggerEventHandler('keydown', {
      which: which,
      key: key,
      preventDefault: () => { },
  });
}
