import { ComponentFixture, tick, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Type, DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}


/** TODO: Look at these functions - consider replacing with *Debug* versions */
// Retreive HTML elment information
export function getLegendContext( fixture: ComponentFixture<any>, componentHtml: string, name: string ) {
  const selector = componentHtml + '[name=' + name + '] legend';
  return fixture.nativeElement.querySelector( selector ).textContent;
}

export function getLabel( fixture: ComponentFixture<any>, componentHtml: string, name: string ) {
  const selector = componentHtml + ' label[for=' + name + '] ';
  return fixture.nativeElement.querySelector( selector );
}


// TODO: Determine whether this is really required - since triggering inputs working in dates
export function getInputElement( fixture: ComponentFixture<any>, componentHtml: string, name: string, inputName: string = null ) {
  const selector = componentHtml + '[name=' + name + '] ' + ( inputName ? 'input[name=' + inputName + ']' :  'input' );
  return fixture.nativeElement.querySelector( selector );
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


export function getDebugElement( fixture: ComponentFixture<any>, componentHtml: string, name: string = null ) {
  const _selector =  name ? componentHtml + '[name=' + name + ']' : componentHtml;
  return fixture.debugElement.query( By.css( _selector ) );
}

export function getInputDebugElement( de: DebugElement, name: string ) {
  let _de = de.nativeElement.querySelector( 'input[name=' + name + ']' );
  if ( !_de ) {

   // Inputs that use 'value' instead of 'ngModel'
    _de =  de.nativeElement.querySelector( 'input[id=' + name + ']' );
  }
  return _de;
}

export function getSelectDebugElement( de: DebugElement, name: string ) {
  return de.nativeElement.querySelector( 'select[name=' + name + ']' );
}

export function getDebugLegend( de: DebugElement ) {
  const _de = de.nativeElement.querySelector( 'legend' );
  return _de ? _de.textContent : null;
}

export function getDebugInlineError( de: DebugElement ) {
  const _de = de.nativeElement.querySelector( 'common-error-container' );
  // console.log( '_de: ', _de );
  return _de ? _de.textContent : null;
}

export function getDebugLabel(  de: DebugElement, name: string ) {
  const _de = de.nativeElement.querySelector( ' label[for=' + name + '] ' );
 //  console.log( '_de: ', _de );
  return _de ? _de.textContent : null;
}

export function setInput( el: any, value: any ) {
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
  el.dispatchEvent(new Event('blur'));
}

// Value of the option
export function setSelect( el: any, value: any ) {
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('blur'));
}

