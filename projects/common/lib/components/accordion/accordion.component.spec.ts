import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';
import { AccordionCommonComponent } from './accordion.component';

describe('AccordionComponent', () => {
  let component: AccordionCommonComponent;
  let fixture: ComponentFixture<AccordionCommonComponent>;
  let el;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordionCommonComponent ],
      imports: [ FormsModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionCommonComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Accordion Title is displayed', () => {
    component.title = 'Show Documents';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(el.querySelector('title').textContent).toEqual('Show Documents');
    });
  });
});
