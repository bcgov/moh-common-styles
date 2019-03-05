import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader.component';
import {ThumbnailComponent} from '../thumbnail/thumbnail.component';
import {ModalModule} from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import {HttpClientModule} from '@angular/common/http';



describe('FileUploaderComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploaderComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule.forRoot(), RouterTestingModule , HttpClientModule ],
      providers: [ ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(FileUploaderComponent);
    expect(fixture.componentInstance instanceof FileUploaderComponent).toBe(true, 'should create FileUploaderComponent');

  });
});
