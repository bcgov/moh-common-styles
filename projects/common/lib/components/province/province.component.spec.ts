import { fakeAsync } from '@angular/core/testing';
import { ProvinceComponent } from './province.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErrorContainerComponent } from '../error-container/error-container.component';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { createTestingModule, tickAndDetectChanges, getInputElement, getLabel } from '../../../helpers/test-helpers';



@Component({
  template: ``
})
class ProvinceTestComponent {
  @ViewChildren(ProvinceComponent) provinceComponent: QueryList<ProvinceComponent>;

  province1: string;
  province2: string;

  defaultLabel: string = 'Province';
}

@Component({
  template: ``,
})
class ProvinceReactTestComponent extends ProvinceTestComponent implements OnInit {

  form: FormGroup;

  constructor( private fb: FormBuilder ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      province1: [ this.province1 ],
      province2: [ this.province2 ]
    });
  }
}

const directives: any[] = [ ErrorContainerComponent, ProvinceComponent ];
const importDirectives: any[] = [ NgSelectModule ];


describe('ProvinceComponent', () => {

  describe('Custom controls - Reactive', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( ProvinceReactTestComponent,
        `<form [formGroup]="form">
          <common-province name='province1' formControlName='province1'></common-province>
         </form>`,
         directives,
         true,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-province', 'province1');
      const label = getLabel( fixture, 'common-province', el.id );

      expect( component.provinceComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.form.get('province1').hasError( 'required' )  ).toBeFalsy();
    }));

  });

  describe('Custom controls - Template', () => {

    it('should create', fakeAsync(() => {
      const fixture = createTestingModule( ProvinceTestComponent,
        `<form>
          <common-province name='province1' [(ngModel)]='province1'></common-province>
         </form>`,
         directives,
         false,
         importDirectives
      );

      const component = fixture.componentInstance;
      tickAndDetectChanges( fixture );
      const el = getInputElement( fixture, 'common-province', 'province1');
      const label = getLabel( fixture, 'common-province', el.id );

      expect( component.provinceComponent ).toBeTruthy();
      expect( label.textContent ).toBe( component.defaultLabel );
      expect( component.provinceComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
    }));

  });





});
