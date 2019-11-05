import { ComponentFixture, tick } from '@angular/core/testing';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
}
