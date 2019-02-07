import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFrameworkComponent } from './page-framework.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageFrameworkComponent', () => {
  let component: PageFrameworkComponent;
  let fixture: ComponentFixture<PageFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFrameworkComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
