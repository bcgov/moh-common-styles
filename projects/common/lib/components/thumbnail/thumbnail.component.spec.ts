import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ThumbnailComponent } from './thumbnail.component';
import {ModalModule} from 'ngx-bootstrap';

describe('ThumbnailComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailComponent],
      imports: [FormsModule, ModalModule.forRoot()],
      providers: []
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(ThumbnailComponent);
    expect(fixture.componentInstance instanceof ThumbnailComponent).toBe(true, 'should create ThumbnailComponent');
  });
});
