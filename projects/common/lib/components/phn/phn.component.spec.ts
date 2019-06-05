import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {PhnComponent} from './phn.component';

describe('PhnComponent', () => {
  let component: PhnComponent;
  let fixture: ComponentFixture<PhnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhnComponent ],
      imports: [
        FormsModule,
        TextMaskModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
