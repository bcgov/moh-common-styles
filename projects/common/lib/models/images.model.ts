import { UUID } from 'angular2-uuid';

// NOTE: If you change anything in this enum, check image-error-modal.component.html for tests and file-uploader.component.ts:
export enum CommonImageError {
  WrongType,
  TooSmall,
  TooBig,
  AlreadyExists,
  Unknown,
  CannotOpen,
  PDFnotSupported,
  CannotOpenPDF,
}

export class CommonImageProcessingError {
  commonImage?: CommonImage;
  rawImageFile?: File;
  maxSizeAllowed?: number;
  // added errorDescription.PDF.JS gives proper error messages as invalid pdf structure or password protected pdf.Good for splunk tracking
  constructor(public errorCode: CommonImageError, public errorDescription?: string) {

  }
}

/**
 * Image as uploaded by user
 */
export class CommonImage<T = any> {

  uuid: string;

  /**
   * @param fileContent (optional) The base64 of an image. See `fileContent` property.
   */
  constructor(fileContent?: string) {
    this.uuid = UUID.UUID();
    if (fileContent) {
      this.fileContent = fileContent;
    }
  }

  /**
   * The base64 content of an image.  Must already be base64 or some other stringable data-type.
   * 
   * You should be able to do <img src='myCommonImage.fileContent'> to render the image.
   */
  fileContent: string;
  documentType: T;

  /**
   * ContentType should generally match the MIME type, but can be set as needed by application.
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   */
  contentType: string;
  // number of bytes.
  size: number;
  sizeUnit: string;
  sizeTxt: string;
  naturalHeight: number;
  naturalWidth: number;
  name: string;

  // file uniqness checksum
  id: string;

  error?: CommonImageError;
  attachmentOrder: number = 0;

  /**
   * Returns the JSON of an image ready to be submitted to the API.  You may
   * have to set attachmentOrder before calling this.
   */
  toJSON(): CommonAttachmentJson<T> {
    return {
      attachmentOrder: this.attachmentOrder, // will be 0 - should it be 1?
      attachmentUuid: this.uuid,
      attachmentDocumentType: this.documentType
    };
  }

}

export interface CommonAttachmentJson<T> {
  attachmentOrder: number;
  attachmentUuid: string;
  attachmentDocumentType: T;
}

export interface CommonImageScaleFactors {
  widthFactor: number;
  heightFactor: number;

  scaleDown(scale: number): CommonImageScaleFactors;
}

export class CommonImageScaleFactorsImpl implements CommonImageScaleFactors {
  widthFactor: number;
  heightFactor: number;

  constructor(wFactor: number, hFactor: number) {
    this.widthFactor = wFactor;
    this.heightFactor = hFactor;
  }

  scaleDown(scale: number): CommonImageScaleFactors {
    return new CommonImageScaleFactorsImpl(
      this.widthFactor * scale,
      this.heightFactor * scale);
  }
}
