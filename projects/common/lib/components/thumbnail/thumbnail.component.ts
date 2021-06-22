import { Component, ViewChild, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonImage } from '../../models/images.model';

@Component({
  selector: 'common-thumbnail',
  templateUrl: './thumbnail.html',
  styleUrls: ['./thumbnail.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThumbnailComponent implements OnInit {
  @Input() imageObject: CommonImage;
  @Input() reviewMode: boolean = false;
  @Output() deleteImage: EventEmitter<CommonImage> = new EventEmitter<CommonImage>();
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  scaledWidth: number = 300;
  ngOnInit() {

    const scaledWidthString: string = (180 * this.imageObject.naturalWidth / this.imageObject.naturalHeight).toFixed(0);
    this.scaledWidth = parseInt(scaledWidthString, 10);

    if (this.scaledWidth > 250) {
      this.scaledWidth = 250;
    } else if (this.scaledWidth < 30) {
      this.scaledWidth = 100;
    }

    if (isNaN(this.scaledWidth)) {
      this.scaledWidth = 300;
    }
  }

  delete(evt: any) {
    this.deleteImage.emit(this.imageObject);
  }

  showFullSizeView() {
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  hideFullSizeView() {
    this.fullSizeViewModal.hide();
  }

}
