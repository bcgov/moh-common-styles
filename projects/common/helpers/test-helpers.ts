import { ComponentFixture, tick, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}


// Retreive HTML elment information
export function getLegendContext( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector('legend').textContent;
}

export function getErrorContainer( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector('common-error-container');
}


// Create test modules
export function createTestingModule<T>( cmp: Type<T>,
                                        template: string,
                                        reactForm: boolean = false,
                                        directives: any[] = null,
                                        importDirectives: any[] = [] ): ComponentFixture<T> {

  const importComp: any = [ BrowserModule, FormsModule ];
  if ( reactForm ) {
    importComp.push( ReactiveFormsModule );
  }

  TestBed.configureTestingModule({
      declarations: [
        cmp,
        directives
      ],
      imports: [
        importComp,
        importDirectives
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).overrideComponent(cmp, {
        set: {
          template: template
        }
      });

  TestBed.compileComponents();

  return TestBed.createComponent(cmp);
}
