import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetComponent } from './street.component';

describe('StreetComponent', () => {
  let component: StreetComponent;
  let fixture: ComponentFixture<StreetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
