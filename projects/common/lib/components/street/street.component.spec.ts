import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StreetComponent } from './street.component';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StreetComponent', () => {
  let component: StreetComponent;
  let fixture: ComponentFixture<StreetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreetComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TypeaheadModule.forRoot()
      ]
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
