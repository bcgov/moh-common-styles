import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreBreadcrumbComponent } from './core-breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CoreBreadcrumbComponent', () => {
  let component: CoreBreadcrumbComponent;
  let fixture: ComponentFixture<CoreBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreBreadcrumbComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
