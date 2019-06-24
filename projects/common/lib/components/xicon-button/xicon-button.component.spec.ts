import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiconButtonComponent } from './xicon-button.component';

describe('XiconButtonComponent', () => {
  let component: XiconButtonComponent;
  let fixture: ComponentFixture<XiconButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiconButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
