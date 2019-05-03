import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryComponent } from './country.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryComponent ],
      imports: [
        CommonModule,
        FormsModule,
        NgSelectModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
