import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDateComponent } from './ng-date.component';

describe('NgDateComponent', () => {
  let component: NgDateComponent;
  let fixture: ComponentFixture<NgDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
