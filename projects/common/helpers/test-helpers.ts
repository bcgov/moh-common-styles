import { ComponentFixture, tick } from '@angular/core/testing';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}



// Retreive HTML elment information
export function getLegendContext( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector('legend').textContent;
}
