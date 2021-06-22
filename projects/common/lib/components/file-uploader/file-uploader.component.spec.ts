import { TestBed } from '@angular/core/testing';
import { FormsModule, ControlContainer, NgForm } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('FileUploaderComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploaderComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule.forRoot(), RouterTestingModule , HttpClientModule ],
      providers: [ ControlContainer, NgForm  ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(FileUploaderComponent);
    expect(fixture.componentInstance instanceof FileUploaderComponent).toBe(true, 'should create FileUploaderComponent');

  });
});
