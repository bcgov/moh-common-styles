import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleModalComponent } from './sample-modal.component';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';

describe('SampleModalComponent', () => {
  let component: SampleModalComponent;
  let fixture: ComponentFixture<SampleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          SampleModalComponent
      ],
      imports: [
          ModalModule.forRoot()
      ],
      providers: [
          BsModalService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
