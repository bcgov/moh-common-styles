import { ComponentFixture, tick, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Type, DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}

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

/*
export function getErrorContainer( fixture: ComponentFixture<any> ) {
  return fixture.nativeElement.querySelector('common-error-container');
}*/


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


export function getDebugElement( fixture: ComponentFixture<any>, componentHtml: string, name: string ) {
  return fixture.debugElement.query( By.css( componentHtml + '[name=' + name + '] ' ) );
}

export function getInputDebugElement( de: DebugElement, name: string ) {
  return de.nativeElement.querySelector( 'input[name=' + name + ']' );
}

export function getSelectDebugElement( de: DebugElement, name: string ) {
  return de.nativeElement.querySelector( 'select[name=' + name + ']' );
}

export function setInput( el: any, value: any ) {

  el.value = value;
  el.dispatchEvent(new Event('blur'));
}

// Value of the option
export function setSelect( el: any, value: any ) {
  el.value = value;
  el.dispatchEvent(new Event('blur'));
}


/*
TODO: Remove if not required
export function triggerTabEvent( de: DebugElement ) {
  de.triggerEventHandler('keydown', { which: 9, key: ''});
}*/
