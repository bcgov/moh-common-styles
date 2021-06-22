import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PostalCodeComponent } from './postal-code.component';
import { FormsModule, NgForm} from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

describe('PostalCodeComponent', () => {
  let component: PostalCodeComponent;
  let fixture: ComponentFixture<PostalCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalCodeComponent ],
      imports: [ FormsModule, TextMaskModule ],
      providers: [ NgForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
