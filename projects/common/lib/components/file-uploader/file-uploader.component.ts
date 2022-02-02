import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    Output,
    ViewChild,
    forwardRef,
    ViewEncapsulation,
    OnChanges,
} from '@angular/core';
import {
    NgForm,
    ControlContainer,
} from '@angular/forms';
import {
    CommonImage,
    CommonImageError,
} from '../../models/images.model';
import { Base } from '../../models/base';
import * as PDFJS_ from 'pdfjs-dist/legacy/build/pdf';
import { pdfJsWorker } from 'pdfjs-dist/legacy/build/pdf.worker.entry';

const PDFJS = (PDFJS_ as any);
PDFJS.workerSrc = pdfJsWorker;

export interface FileUploaderMsg {
    required: string;
}

interface Size {
    width: number,
    height: number,
}

const MAX_IMAGE_SIZE_BYTES: number = 1048576;
const MAX_IMAGE_COUNT: number = 50;
const MAX_IMAGE_WIDTH: number = 3300;
const MAX_IMAGE_HEIGHT: number = 3300;
const MIN_IMAGE_WIDTH: number = 200;
const MIN_IMAGE_HEIGHT: number = 200;
const MIN_IMAGE_SIZE_BYTES: number = 20000;
const JPEG_COMPRESSION: number = 0.5;
const IMAGE_CONTENT_TYPE = 'image/jpeg';
const IMAGE_REDUCTION_SCALE_FACTOR: number = 0.8;

@Component({
    selector: 'common-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    encapsulation: ViewEncapsulation.None,
    viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class FileUploaderComponent extends Base {
    @ViewChild('browseFileRef') browseFileRef: ElementRef;

    @Input() images: Array<CommonImage> = new Array<CommonImage>(0);
    @Input() id: string;
    @Input() showError: boolean;
    @Input() required: boolean = false;
    @Input() instructionText: string = 'Please upload required ID documents.';
    @Input() errorMessages: FileUploaderMsg = { required: 'File is required.' };

    @Output() imagesChange: EventEmitter<Array<CommonImage>> = new EventEmitter<Array<CommonImage>>();
    @Output() errorDocument: EventEmitter<CommonImage> = new EventEmitter<CommonImage>();

    constructor(private zone: NgZone,
                private controlContainer: ControlContainer) {
        super();
    }

    /** Opens the file upload dialog from the browser. */
    public openFileDialog() {
        this.browseFileRef.nativeElement.click();
    }

    public handleDragOver(event): void {
        event.preventDefault();
    }

    public handleDrop(event): void {
        event.preventDefault();
  
        const files = event.dataTransfer.files;
  
        // Don't proceed if no file(s) were selected.
        if (!files || files.length === 0) {
            return;
        }
        
        // Clear previous error message.
        //this.errorMessage = null;
  
        // Process each file dropped.
        for (let i=0; i<files.length; i++) {
            this.processFile(files[i]);
        }
    }

    public handleChangeFile(event): void {
        const files = event.target.files;
  
        // Don't proceed if no file(s) were selected.
        if (!files || files.length === 0) {
            return;
        }
        
        // Clear previous error message.
        //this.errorMessage = null;
  
        // Process each file selected.
        for (let i=0; i<files.length; i++) {
            this.processFile(files[i]);
        }
  
        // Clear selected files.
        event.target.value = '';
    }

    private async processFile(file: File) {
        switch (file.type) {
            case 'application/pdf':
                try {
                    const images = await this.processPDFFile(file);
                    await this.addFileImages(file.name, images);
                } catch (error) {
                    this.handleError(error);
                }
                break;

            default:
                try {
                    const image = await this.processImageFile(file);
                    await this.addFileImages(file.name, [image]);
                } catch (error) {
                    this.handleError(error);
                }
                break;
        }
    }

    private processPDFFile(file: File): Promise<Array<CommonImage>> {
        const reader = new FileReader();
        const images = [];
  
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const docInitParams = {
                    data: reader.result
                };
                PDFJS.getDocument(docInitParams).promise.then(async (pdfDoc) => {
                    if (pdfDoc.numPages + this.images.length > MAX_IMAGE_COUNT) {
                        reject(CommonImageError.TooBig);
                        return;
                    }
                    for (let pageNumber=1; pageNumber<=pdfDoc.numPages; pageNumber++) {
                        try {
                            let image = await this.getPageImage(pdfDoc, pageNumber);

                            // Check image size.
                            if (image.size <= MAX_IMAGE_SIZE_BYTES) {
                                images.push(image);
                            } else {
                                const scaledImage = await this.scaleImage(image);
                                images.push(scaledImage);
                            }
                            
                        } catch (error) {
                            const message = `Error reading page ${pageNumber} of the PDF.`;
                            console.log(message, error);
                            reject(CommonImageError.CannotOpenPDF);
                            return;
                        }
                    }
                    resolve(images);
                }, () => {
                    reject(CommonImageError.CannotOpenPDF);
                });
            };
            reader.readAsArrayBuffer(file);
        });
    }

    private getPageImage(pdfDoc, pageNumber): Promise<CommonImage> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        return new Promise((resolve, reject) => {
            pdfDoc.getPage(pageNumber).then((page) => {
                const viewport = page.getViewport({ scale: 2.0 });
    
                // Sometimes width and height can be NaN, so use viewBox instead.
                if (viewport.width && viewport.height) {
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                } else {
                    canvas.width = viewport.viewBox[2];
                    canvas.height = viewport.viewBox[3];
                }
    
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
    
                page.render(renderContext).promise.then(async () => {
                    const dataURL = canvas.toDataURL('image/jpeg', JPEG_COMPRESSION);
                    const image: CommonImage = await this.createImage(dataURL);
                    resolve(image);
                },
                (error) => {
                    console.log('PDFJS render error:', error);
                    reject(CommonImageError.CannotOpenPDF);
                });
            }).catch((error) => {
                console.log('PDFJS getPage() error:', error);
                reject(CommonImageError.CannotOpenPDF);
            });
        });
    }

    private processImageFile(file: File): Promise<CommonImage> {
        const reader = new FileReader();

        if (this.images.length >= MAX_IMAGE_COUNT) {
            return Promise.reject(CommonImageError.TooBig);
        }
  
        return new Promise<CommonImage>((resolve, reject) => {
            reader.onload = async () => {
                try {
                    let image: CommonImage = await this.createImage(reader.result);
                    if (image.size > MAX_IMAGE_SIZE_BYTES) {
                        image = await this.scaleImage(image);
                    }
                    resolve(image);
                } catch(_) {
                    reject(CommonImageError.CannotOpen);
                }
            };
            reader.onerror = () => {
                reject(CommonImageError.CannotOpen);
            }
            reader.readAsDataURL(file);
        });
    }

    private async scaleImage(image: CommonImage): Promise<CommonImage> {
        return new Promise<CommonImage>((resolve, reject) => {
            // We create an image to receive the Data URI
            const img: HTMLImageElement = document.createElement('img');
    
            // When the event "onload" is triggered we can resize the image.
            img.onload = () => {
                // We create a canvas and get its context.
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
    
                const targetWidth: number = Math.floor(img.width * IMAGE_REDUCTION_SCALE_FACTOR);
                const targetHeight: number = Math.floor(img.height * IMAGE_REDUCTION_SCALE_FACTOR);
    
                // We set the dimensions at the wanted size.
                canvas.width = targetWidth;
                canvas.height = targetHeight;
    
                // We resize the image with the canvas method drawImage();
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                canvas.toBlob((blob: Blob) => {
                    const reader = new FileReader();
                    reader.onload = async (event: any) => {
                        const scaledImage: CommonImage = image.clone();
                        scaledImage.fileContent = event.target.result;
                        scaledImage.size = blob.size;
                        scaledImage.naturalWidth = targetWidth;
                        scaledImage.naturalHeight = targetHeight;
                        scaledImage.calculateSize();

                        if (scaledImage.size > MAX_IMAGE_SIZE_BYTES) {
                            resolve(await this.scaleImage(scaledImage))
                        } else {
                            resolve(scaledImage);
                        }
                    };
                    reader.onerror = () => {
                      reject(CommonImageError.CannotOpen);
                    }
                    reader.readAsDataURL(blob);
                }, IMAGE_CONTENT_TYPE, JPEG_COMPRESSION);
            };
    
            img.onerror = () => {
                reject(CommonImageError.CannotOpen);
            }
    
            // We put the Data URI in the image's src attribute
            img.src = image.fileContent;
        });
    }

    private createImage(imageDataURL): Promise<CommonImage> {
        const image = new CommonImage(imageDataURL);

        return new Promise<CommonImage>((resolve, reject) => {
            // We create an image to receive the Data URI
            const img: HTMLImageElement = document.createElement('img');
    
            // When the event "onload" is triggered we can resize the image.
            img.onload = () => {
                // We create a canvas and get its context.
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const size: Size = this.getConstrainedSize(img.width, img.height);
    
                if (size.width < MIN_IMAGE_WIDTH || size.height < MIN_IMAGE_HEIGHT) {
                    reject(CommonImageError.TooSmall);
                }
                const width: number = size.width;
                const height: number = size.height;
    
                // We set the dimensions at the wanted size.
                canvas.width = width;
                canvas.height = height;
    
                // We resize the image with the canvas method drawImage();
                ctx.drawImage(img, 0, 0, width, height);
    
                canvas.toBlob(async (blob) => {
                    const reader = new FileReader();
                    
                    if (blob.size < MIN_IMAGE_SIZE_BYTES) {
                        reject(CommonImageError.TooSmall);
                    }
                    reader.onload = (event: any) => {
                        image.fileContent = event.target.result;
                        image.size = blob.size;
                        image.naturalWidth = width;
                        image.naturalHeight = height;
                        image.calculateSize();
                        resolve(image);
                    };
                    reader.onerror = () => {
                      reject(CommonImageError.CannotOpen);
                    }
                    reader.readAsDataURL(blob);
                }, IMAGE_CONTENT_TYPE, JPEG_COMPRESSION);
            };
    
            img.onerror = () => {
                reject(CommonImageError.CannotOpen);
            }
    
            // We put the Data URI in the image's src attribute
            img.src = image.fileContent;
        });
    }

    private async addFileImages(fileName: string, images: Array<CommonImage>) {
        // Create image objects.
        for (let i=0; i<images.length; i++) {
            const fullFileName: string = `${fileName}${images.length > 1 ? '.page-' + (i+1) : ''}`;
            const image = images[i];

            image.name = fullFileName; // image.name has been deprecated.
            image.id = fullFileName;
            image.contentType = IMAGE_CONTENT_TYPE;
        }
  
        return new Promise((resolve, reject) => {
        // Merge new images with existing images.
            const imagesToAdd = new Array<CommonImage>();
            images.forEach((image) => {
                const existingIndex = this.images.findIndex((existingImage) => existingImage.fileContent === image.fileContent);
                // If image doesn't already exist, 
                if (existingIndex === -1) {
                    imagesToAdd.push(image);
                }
            });
            if (imagesToAdd.length === 0) {
                reject(CommonImageError.AlreadyExists);
                return;
            }
            this.images = [
                ...this.images,
                ...imagesToAdd,
            ];
            this.imagesChange.emit(this.images);
            resolve();
        });
    }

    public deleteImage(image: CommonImage) {
        this.resetFileInput();
        this.images = this.images.filter(x => x.uuid !== image.uuid);
        this.imagesChange.emit(this.images);

        // If there are no images yet, we have to reset the input so it triggers 'required'.
        if (this.required && this.images.length <= 0) {
            this.fileControl.setErrors({ required: true });
        }
    }

    private resetFileInput() {
        this.browseFileRef.nativeElement.value = '';
    }

    /**
     * This is created as a workaround to access the form control that binds to
     * the input[type='file']. We can't access it via the template name bindings
     * as that isn't working, so instead we access the parent form and then find
     * the input by name.
     */
    get fileControl() {
        const INPUT_NAME = `fileUploadBrowse-${this.id}`;
        // note - should be "this.controlContainer as NgForm" here, which works,
        // but fails on compiliation due to secondary entries
        return (this.controlContainer as any).controls[INPUT_NAME];
    }

    private handleError(error: CommonImageError, image?: CommonImage) {
        if (!image) {
            image = new CommonImage();
        }
        // just add the error to mspImage
        image.error = error;

        this.errorDocument.emit(image);
    }

    private getConstrainedSize(width: number, height: number): Size {
        let targetWidth: number = width;
        let targetHeight: number = height;

        if (width >= height) {
            if (width > MAX_IMAGE_WIDTH) {
                targetWidth = MAX_IMAGE_WIDTH;
                targetHeight = height * MAX_IMAGE_WIDTH / width;
            }
        } else {
            if (height > MAX_IMAGE_HEIGHT) {
                targetWidth = width * MAX_IMAGE_HEIGHT / height;
                targetHeight = MAX_IMAGE_HEIGHT;
            }
        }
        return {
            width: Math.floor(targetWidth),
            height: Math.floor(targetHeight)
        }
    }

    /**
     * A special method to force the rendering of this component.  This is a workaround
     * because for some unknown reason, AngularJS2 change detector does not detect the
     * change of the images Array.
     */
    forceRender() {
        this.zone.run(() => {});
    }

    handleKeyDownFileBrowse(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.openFileDialog();
        }
    }
}
