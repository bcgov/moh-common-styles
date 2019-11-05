import { ComponentFixture, tick } from '@angular/core/testing';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick(100);
  fixture.detectChanges();
  tick();
}
