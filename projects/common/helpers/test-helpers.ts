import { ComponentFixture, tick, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Type, DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}

// Create test modules
export function createTestingModule<T>( cmp: Type<T>,
                                        template: string,
                                        directives: any[],
                                        reactForm: boolean = false,
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
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    }).overrideComponent(cmp, {
        set: {
          template: template
        }
      });

  TestBed.compileComponents();

  return TestBed.createComponent(cmp);
}


export function getDebugElement( fixture: ComponentFixture<any>, componentHtml: string, name: string = null ): DebugElement {
  const _selector =  name ? componentHtml + '[name=\"' + name + '\"]' : componentHtml;
  return fixture.debugElement.query( By.css( _selector ) );
}

export function getInputDebugElement( de: DebugElement, name: string ): DebugElement {
  let _de = de.query( By.css( 'input[name=\"' + name + '\"]' ) );
  if ( !_de ) {

   // Inputs that use 'value' instead of 'ngModel'
    _de =  de.query( By.css( 'input[id=\"' + name + '\"]' ) );
  }
  return _de;
}

export function getSelectDebugElement( de: DebugElement, name: string ): DebugElement {
  return de.query( By.css( 'select[name=\"' + name + '\"]' ) );
}

export function getDebugLegend( de: DebugElement ): string {
  const _de = de.query( By.css( 'legend' ) );
  return _de ? _de.nativeElement.textContent : null;
}

export function getDebugInlineError( de: DebugElement ): string {
  const _de = de.query( By.css(  'common-error-container' ) );
  return _de ? _de.nativeElement.textContent : null;
}

export function getDebugLabel( de: DebugElement, name: string ): string {
  const _de = de.query( By.css( 'label[for=\"' + name + '\"]' ) );
  return _de ? _de.nativeElement.textContent : null;
}

export function setInput( de: DebugElement, value: any ) {
  const el = de.nativeElement;
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
  el.dispatchEvent(new Event('blur'));
}

// Value of the option
export function setSelect( de: DebugElement, value: any ) {
  const el = de.nativeElement;
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('blur'));
}
