import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownComponent ],
      imports: [
        CommonModule,
        FormsModule,
        NgSelectModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
