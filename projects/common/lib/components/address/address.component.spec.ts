import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import { AddressComponent } from './address.component';
import { FormsModule, NgForm } from '@angular/forms';
import { BASE_URL } from '../../../services/cache-api.service';
import { SharedCoreModule } from 'moh-common-lib';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { TypeaheadModule } from 'ngx-bootstrap';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddressComponent
       ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgSelectModule,
        TextMaskModule,
        TypeaheadModule.forRoot(),
        SharedCoreModule
      ],
      providers: [
        NgForm,
        { provide: BASE_URL, useValue: '/api/reg/rest' },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
