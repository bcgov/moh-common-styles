import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ConsentModalComponent } from './consent-modal.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';


describe('ConsentModalComponent', () => {
  let component: ConsentModalComponent;
  let fixture: ComponentFixture<ConsentModalComponent>;
  let el;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentModalComponent],
      imports: [ FormsModule, HttpClientModule, RouterTestingModule, ModalModule.forRoot(), BrowserModule],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentModalComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Consent Modal Title is displayed', () => {
    component.title = 'Information Notice';
    component.body = 'Please go through the Notice';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('body').textContent).toEqual('Please go through the Notice');
    });
  });

  it ('Consent Modal checked and proceed', () => {
    spyOn(component, 'continue').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.continue).toBeTruthy();
    });
  });


});
