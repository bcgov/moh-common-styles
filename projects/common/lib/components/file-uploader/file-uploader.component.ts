import { AfterContentInit, ChangeDetectorRef, Component,
    ElementRef, EventEmitter, Input, NgZone, OnChanges,
    OnInit, Output, SimpleChanges, ViewChild, forwardRef, ViewEncapsulation } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import { Observable,  Observer, fromEvent, merge } from 'rxjs';
import { map, filter, flatMap, scan, delay, retryWhen } from 'rxjs/operators';
import { CommonImage, CommonImageError, CommonImageProcessingError,
CommonImageScaleFactors, CommonImageScaleFactorsImpl } from '../../models/images.model';
import { Router } from '@angular/router';
import { Base } from '../../models/base';

import * as loadImage_ from 'blueimp-load-image';
const loadImage = loadImage_;
import * as sha1_ from 'sha1';
const sha1 = sha1_;

import * as PDFJS_ from 'pdfjs-dist/legacy/build/pdf';
const PDFJS = (PDFJS_ as any);

import { pdfJsWorker } from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { promise } from 'protractor';
PDFJS.workerSrc = pdfJsWorker;

export interface FileUploaderMsg {
    required: string;
}

// TODO - Remove this and fix tslint issues
/* tslint:disable:max-line-length*/

const MAX_IMAGE_SIZE_BYTES: number = 1048576;
const MAX_IMAGE_COUNT: number = 50;
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
export class FileUploaderComponent extends Base
    implements OnInit, OnChanges, AfterContentInit {
    noIdImage: Boolean = false;
    private isProcessingFile: Boolean = false;
    @ViewChild('dropZone') dropZone: ElementRef;
    @ViewChild('browseFileRef') browseFileRef: ElementRef;
    @ViewChild('imagePlaceholderRef') imagePlaceholderRef: ElementRef;
    @ViewChild('selectFileLabel') selectFileLabelRef: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;

    @Input() images: Array<CommonImage> = new Array<CommonImage>(0);
    @Input() id: string;
    @Input() showError: boolean;
    @Input() required: boolean = false;
    @Input() instructionText: string = 'Please upload required ID documents.';
    @Input() errorMessages: FileUploaderMsg = { required: 'File is required.' };

    @Output() imagesChange: EventEmitter<Array<CommonImage>> = new EventEmitter<Array<CommonImage>>();
    @Output() errorDocument: EventEmitter<CommonImage> = new EventEmitter<CommonImage>();

    constructor(
                private zone: NgZone,
                private cd: ChangeDetectorRef , private router: Router,
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
        console.log('Process file.');
        this.isProcessingFile = true;

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
        this.isProcessingFile = false;
    }

    processPDFFile(file): Promise<Array<CommonImage>> {
        const reader = new FileReader();
        const images = [];
  
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const docInitParams = {
                    data: reader.result
                };
                PDFJS.getDocument(docInitParams).promise.then(async (pdfDoc) => {
                    if (pdfDoc.numPages > MAX_IMAGE_COUNT) {
                        reject(CommonImageError.PDFnotSupported);
                        return;
                    }
                    for (let pageNumber=1; pageNumber<=pdfDoc.numPages; pageNumber++) {
                        try {
                            let image = await this.getPageImage(pdfDoc, pageNumber);

                            // Check image size.
                            if (image.size <= MAX_IMAGE_SIZE_BYTES) {
                                console.log('Unscaled image:', image);
                                images.push(image);
                            } else {
                                const scaledImage = await this.scaleImage(image);
                                console.log('Scaled image:', scaledImage);
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

    getPageImage(pdfDoc, pageNumber): Promise<CommonImage> {
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
    
                const width: number = img.width;
                const height: number = img.height;
    
                // We set the dimensions at the wanted size.
                canvas.width = width;
                canvas.height = height;
    
                // We resize the image with the canvas method drawImage();
                ctx.drawImage(img, 0, 0, width, height);
    
                canvas.toBlob(async (blob) => {
                    const reader = new FileReader();
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
    
            img.onerror = (error) => {
                console.log('img on error', error);
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

    public removeImage(image: CommonImage) {
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

    private doesImageExist(image: CommonImage): Boolean {
        if (!this.images || this.images.length < 1) {
            return false;
        }
        for (let i=0; i<this.images.length; i++) {
            if (this.images[i].fileContent === image.fileContent) {
                console.log(`This file ${image.name} has already been uploaded.`);
                return true;
            }
        }
        return false;
    }


































    /**
     * Return true if file already exists in the list; false otherwise.
     */
    static checkImageExists(file: CommonImage, imageList: Array<CommonImage>) {
        if (!imageList || imageList.length < 1) {
            return false;
        } else {

            const sha1Sum = sha1(file.fileContent);
            for (let i = imageList.length - 1; i >= 0; i--) {
                if (imageList[i].id === sha1Sum) {
                    console.log(`This file ${file.name} has already been uploaded.`);
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * A special method to force the rendering of this component.  This is a workaround
     * because for some unknown reason, AngularJS2 change detector does not detect the
     * change of the images Array.
     */
    forceRender() {
        this.zone.run(() => {
        });
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['images'] && (
            (changes['images'].currentValue && changes['images'].currentValue.length === 0)
            && changes['images'].previousValue
            && changes['images'].previousValue.length > 0)
        ) {
            this.noIdImage = true;
        } else {
            this.noIdImage = false;
        }
    }

    /*
     System processing steps

     1. User clicks browse or drag-n-drops an file
     2. For browse case, the browser is told to only accept mime type image/*, .JPG, .GIF, .PNG, etc,
     however user can override and for drag-n-drop we don't can't impose this filter
     4. Using the HTML5 File API, we open a handle on the file
     5. Read the filename for later display to the user
     6. Create a hidden Image element in the browser's DOM
     7. Read the file's bytes as a DataUrl and copy them into the Image element
     8. Wait until the Image finishes loading the image
     9. Read the image element's natural width and height
     10. Pass the File handle into a HTML5 Canvas lib (we need the XIFF headers to auto rotate, XIFF headers are not available in DataUrl)
     11. The Canvas errors because it's a wrong type, e.g., TIFF, we abort and notify user
     12. Instruct the Canvas lib to keep resizing the image if it exceeds a maximum width or height,
     extract meta data, and auto-orient based on XIFF metadata.  It uses a "contain" operation which retains
     it's width to height pixel ratio.
     13. Call a function on the Canvas element to turn the Canvas into a JPEG of quality 50%.
     14. Once in a Blob with get the blob size in bytes and a human friendly display size
     15. In order to more easily manage the image, we convert the Blob to a DataUrl again.
     16. Pass the DataUrl into a hash algorithm to create an identifier and to check if the image has already been uploaded
     17. Next we check the final size of the image to ensure it's not to small in resolution
     (arguably this could've been done earlier), if too small we notify user
     18. Finally, the image is saved into the user's ongoing EA/PA application including localstorage
     19. The image is displayed to user as a thumbnail

     */

    ngOnInit(): void {


        // const dragOverStream =
        //     fromEvent<DragEvent>(this.dropZone.nativeElement, 'dragover');

        // /**
        //  * Must cancel the dragover event in order for the drop event to work.
        //  */
        // dragOverStream.pipe(map(evt => {
        //     return event;
        // })).subscribe(evt => {
        //     evt.preventDefault();
        // });

        // const dropStream = fromEvent<DragEvent>(this.dropZone.nativeElement, 'drop');
        // const filesArrayFromDrop = dropStream.pipe(
        //     map(
        //         function (event) {
        //             event.preventDefault();
        //             return event.dataTransfer.files;
        //         }
        //     ));

        // const browseFileStream = fromEvent<Event>(this.browseFileRef.nativeElement, 'change');
        // // const captureFileStream = fromEvent<Event>(this.captureFileRef.nativeElement, 'change');

        // merge(merge(browseFileStream).pipe(
        //     map(
        //         (event) => {
        //             event.preventDefault();
        //             return event.target['files'];

        //         }
        //     )),
        //     filesArrayFromDrop).pipe(
        //         filter(files => {
        //             return !!files && files.length && files.length > 0;
        //         }),
        //         flatMap(
        //             (fileList: FileList) => {

        //                 return this.observableFromFiles(fileList, new CommonImageScaleFactorsImpl(1, 1));
        //             }
        //         ),
        //         filter(
        //             (mspImage: CommonImage) => {

        //                 const imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
        //                 if (imageExists) {
        //                     this.handleError(CommonImageError.AlreadyExists, mspImage);
        //                     this.resetInputFields();
        //                 }
        //                 return !imageExists;
        //             }
        //         ),
        //         // TODO - Is this necessary? Can likely be removed as it's exactly identical to the preceding.
        //         filter((mspImage: CommonImage) => {

        //             const imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
        //                 if (imageExists) {
        //                     this.handleError(CommonImageError.AlreadyExists, mspImage);
        //                     this.resetInputFields();
        //                 }
        //                 return !imageExists;
        //             }
        //         ),
        //         filter((mspImage: CommonImage) => {

        //             const imageSizeOk = this.checkImageDimensions(mspImage);
        //                 if (!imageSizeOk) {
        //                     this.handleError(CommonImageError.TooSmall, mspImage);
        //                     this.resetInputFields();
        //                 }
        //                 return imageSizeOk;
        //             }
        //         )
        //     ).subscribe(
        //     (file: CommonImage) => {

        //         this.handleImageFile(file);
        //         this.resetInputFields();
        //     },

        //     (error) => {},
        //     () => {
        //         // console.log('completed loading image');
        //     }
        // );
    }

    ngAfterContentInit() {

        const imagePlaceholderEnterKeyStream = merge(
            fromEvent<Event>(this.imagePlaceholderRef.nativeElement, 'keyup'),
            fromEvent<Event>(this.selectFileLabelRef.nativeElement, 'keyup'),
            // fromEvent<Event>(this.uploadInstructionRef.nativeElement, 'keyup')
        ).pipe(filter((evt: KeyboardEvent) => evt.key === 'Enter'));

        merge(
            fromEvent<Event>(this.imagePlaceholderRef.nativeElement, 'click'),
            // fromEvent<Event>(this.uploadInstructionRef.nativeElement, 'click'),
            imagePlaceholderEnterKeyStream
        ).pipe(
            map((event) => {
                event.preventDefault();
                return event;
            })
        ).subscribe( (event) => { this.browseFileRef.nativeElement.click(); });
    }

    /**
     * Solve size in this equation: size * 0.8to-the-power-of30 < 1MB, size
     * will be the max image size this application can accept and scale down
     * to under 1MB. In this case: size < 807 MB
     *
     * 30 is the number of retries. the value for maxRetry passed to retryStrategy
     * function.
     *
     * If: size * 0.8to-the-power-of40 < 1MB, then size < 1262 MB.
     *
     * Note: 0.8 is the self.appConstants.images.reductionScaleFactor defined in global.js
     *
     *
     * @param file
     * @param scaleFactors
     */
    observableFromFiles(fileList: FileList, scaleFactors: CommonImageScaleFactors) {
        /** Previously this was set in appConstants, but that's removed from the common lib. */
        const reductionScaleFactor = 0.8;

        // Init
        const self = this;
        let pageNumber = Math.max(...self.images.map(function(o) {return o.attachmentOrder; }), 0) + 1 ;

        // Create our observer
        const fileObservable = Observable.create((observer: Observer<CommonImage>) => {
            const mspImages = [];
            scaleFactors = scaleFactors.scaleDown(reductionScaleFactor);
            for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
                const file = fileList[fileIndex];

                /* Previously set in appConstants */
                const pdfScaleFactor = 2.0;

                // // Copy file properties
                if (file.type === 'application/pdf') {

                    /**
                     *  Page number logic :
                     *      Images - Assign current page number whichever is available..so get the current page number , pass it to call back [reserve it] and increment
                     *      PDF    -  we dont know how many pages..so cant get current number and keep it since it can be multiple pages... so start assigning later point
                     *      when PDF is totally read..
                     *
                     *  */

                    this.readPDF(file, pdfScaleFactor, (images: HTMLImageElement[] , pdfFile: File) => {
                        images.map((image, index) => {
                            image.name = pdfFile.name;
                            this.resizeImage( image, self, scaleFactors, observer, pageNumber , true); // index starts from zero
                            pageNumber = pageNumber + 1  ;
                        });
                    }, (error: string) => {
                        const imageReadError: CommonImageProcessingError =
                            new CommonImageProcessingError(CommonImageError.CannotOpenPDF, error);
                        self.filterError(imageReadError);
                    });
                } else {
                    // Load image into img element to read natural height and width
                    this.readImage(file, pageNumber , (image: HTMLImageElement , imageFile: File , nextPageNumber: number)  => {
                            image.id = imageFile.name; // .name deprecated, changed image.name to image.id
                            this.resizeImage(image, self, scaleFactors, observer , nextPageNumber );
                        },

                        // can be ignored for bug, the log line is never called
                        (error: CommonImageProcessingError) => {
                            self.filterError(error);
                        });
                    pageNumber = pageNumber + 1  ;
                }
            }

            // retryWhen is potential issue!
        }).pipe(retryWhen(this.retryStrategy(32)));
        return fileObservable;
    }


    private resizeImage( image: HTMLImageElement, self: this, scaleFactors: CommonImageScaleFactors, observer: Observer<CommonImage>, pageNumber: number = 0 , isPdf: boolean = false) {
        // While it's still in an image, get it's height and width
        const mspImage: CommonImage = new CommonImage();
        const reader: FileReader = new FileReader();
        // Copy file properties
        mspImage.name = image.id ;
        if (isPdf) {
            mspImage.name = image.name + '-page' + pageNumber;  // Just give name to pdf
      }

        mspImage.attachmentOrder = pageNumber ;


        mspImage.naturalWidth = image.naturalWidth;
        mspImage.naturalHeight = image.naturalHeight;

        // Canvas will force the change to a JPEG
        mspImage.contentType = 'image/jpeg'; // previously in appConstants

        // Scale the image by loading into a canvas
        const scaledImage = loadImage(
            image.src, // NOTE: we pass the File ref here again even though its already read because we need the XIFF metadata
            function (canvas: HTMLCanvasElement, metadata: any) {

                // Canvas may be an Event when errors happens
                if (canvas instanceof Event) {
                    self.handleError(CommonImageError.WrongType, mspImage);
                    self.resetInputFields();
                    return;
                }
                // Convert to blob to get size
                canvas.toBlob((blob: Blob) => {
                        // Copy the blob properties
                        mspImage.size = blob.size;

                        const fileName = mspImage.name;
                        const nBytes = mspImage.size;
                        let fileSize = '';
                        let fileSizeUnit = '';
                        let sOutput: string = nBytes + ' bytes';
                        // optional code for multiples approximation
                        for (let aMultiples = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
                                 nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {

                            sOutput = nApprox.toFixed(3) + ' ' + aMultiples[nMultiple] + ' (' + nBytes + ' bytes)';
                            fileSize = nApprox.toFixed(0);
                            fileSizeUnit = aMultiples[nMultiple];
                            mspImage.sizeUnit = fileSizeUnit;
                        }

                        mspImage.sizeTxt = sOutput;

                        // call reader with new transformed image
                        reader.onload = function (evt: any) {

                            mspImage.fileContent = evt.target.result;
                            mspImage.id = sha1(mspImage.fileContent);

                            // keep scaling down the image until the image size is
                            // under max image size

                            /** previously in appConstants */
                            const maxSizeBytes = 1048576;
                            if (mspImage.size > maxSizeBytes) {
                                const imageTooBigError: CommonImageProcessingError =
                                    new CommonImageProcessingError(CommonImageError.TooBig);

                                imageTooBigError.maxSizeAllowed = maxSizeBytes;
                                imageTooBigError.commonImage = mspImage;

                                self.filterError(imageTooBigError);
                            } else {
                                // log image info
                                observer.next(mspImage);
                            }
                        };
                        reader.readAsDataURL(blob);
                    },

                    // What mime type to make the blob as and jpeg quality
                    'image/jpeg', 0.5);
            },
            {
                maxWidth: 2600 * scaleFactors.widthFactor,
                maxHeight: 3300 * scaleFactors.heightFactor,
                contain: true,
                canvas: true,
                meta: true,
                orientation: true
            }
        );
    }

    /**
     * Max retry scaling down for maxRetry times.
     */
    retryStrategy(maxRetry: number) {
        return function (errors: Observable<CommonImageProcessingError>) {

            /**Done: COMPLETE THIS! For some reason can't get scan() to work, types always malformed.*/

            // return errors.pipe(
            //     // scan((acc, curr) => {acc + curr}, 0)
            //     scan((acc, error, index) => {
            //         return acc + error;
            //     }, 0)
            // );

            // Done: Unsure if we have to re-implement this line. It causes errors, but simply removing it may not be appropriate.
            // NOTE: RxJS-compat might be saving us here and "fixing" the errors. See if errors return when we remove rxjs-compat.
            // return errors.pipe(scan((acc, curr) => acc + curr, 0))


            return errors.pipe(scan(
                // return errors.pipe(
                (acc, error: any, index) => {

                    /**
                     * If the error is about file too big and we have not reach max retry
                     * yet, theyt keep going to scaling down.
                     */
                    if (acc < maxRetry && error.errorCode === CommonImageError.TooBig) {
                        return acc + 1;
                    } else {
                        /**
                         * For either conditions terminate the retry, propogate
                         * the error.
                         *
                         * 1. errors such as CannotRead or any other unknown errors
                         * not listed in MspImageError enum
                         * 2. Exceeded maxRetry
                         *
                         */
                        throw error;
                    }
                }, 0
            ), delay(2));
        };
    }

    private readImage(imageFile: File, nextPageNumber: number ,
                      callback: (image: HTMLImageElement, imageFile: File , nextPageNumber: number) => void,
                      invalidImageHanlder: (error: CommonImageProcessingError) => void) {
        const reader = new FileReader();

        reader.onload = function (progressEvt: ProgressEvent) {

            // Load into an image element
            const imgEl: HTMLImageElement = document.createElement('img');
            imgEl.src = (reader.result as string);

            // Wait for onload so all properties are populated
            imgEl.onload = (args) => {
                return callback(imgEl, imageFile, nextPageNumber);
            };

            imgEl.onerror =
                (args) => {

                    // log it to the console
                    console.log('This image cannot be opened/read, it is probably an invalid image. %o', args);

                    // throw new Error('This image cannot be opened/read');
                    const imageReadError: CommonImageProcessingError =
                        new CommonImageProcessingError(CommonImageError.CannotOpen);

                    imageReadError.rawImageFile = imageFile;

                    return invalidImageHanlder(imageReadError);
                };
        };

        reader.readAsDataURL(imageFile);
    }

    private readPDF(pdfFile: File, pdfScaleFactor: number,
                    callback: (image: HTMLImageElement[], pdfFile: File) => void, error: (errorReason: any) => void) {

        PDFJS.disableWorker = true;
        PDFJS.disableStream = true;

        const reader = new FileReader();
        let currentPage = 1;
        const canvas = document.createElement('canvas');
        const imgElsArray: HTMLImageElement[] = [];
        const ctx = canvas.getContext('2d');
        reader.onload = function (progressEvt: ProgressEvent) {

            const docInitParams = {data: reader.result};
            // TODO - The 'as any' was added when porting to common library from MSP
            PDFJS.getDocument((docInitParams as any)).promise.then((pdfdoc) => {
                const numPages = pdfdoc.numPages;
                if (currentPage <= pdfdoc.numPages) { getPage(); }

                function getPage() {
                    pdfdoc.getPage(currentPage).then(function (page) {
                        const viewport = page.getViewport(pdfScaleFactor);

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };

                        page.render(renderContext).promise.then(function () {
                            const imgEl: HTMLImageElement = document.createElement('img');
                            imgEl.src = canvas.toDataURL();
                            imgElsArray.push(imgEl);
                            if (currentPage < numPages) {
                                currentPage++;
                                getPage();
                            } else {
                                callback(imgElsArray, pdfFile);
                            }

                        });
                    }, function (errorReason: string) {
                        error(errorReason);

                    });
                }
            }, function (errorReason: string) {
                error(errorReason);
            });

        };
        reader.readAsArrayBuffer(pdfFile);

    }


    /**
     * Non reversible image filter to take an existing canvas and make it gray scale
     * @param canvas
     */
    makeGrayScale(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }

        // overwrite original image
        context.putImageData(imageData, 0, 0);
    }


    handleImageFile(mspImage: CommonImage) {
        if (this.images.length >= 50) {
            console.log(`Max number of image file you can upload is ${50}.
      This file ${mspImage.name} was not uploaded.`);
        } else {
            this.images.push(mspImage);
            this.imagesChange.emit(this.images);
            this.showError = false;
            this.noIdImage = false;
        }
    }

    filterError(error): void {

        /**
         * Handle the error if the image is gigantic that after
         * 100 times of scaling down by 30% on each step, the image
         * is still over 1 MB.
         */
        if (error.errorCode) {
            if (CommonImageError.TooBig === error.errorCode) {
                this.handleError(CommonImageError.TooBig, error.image);
            } else if (CommonImageError.CannotOpen === error.errorCode) {
                if (!error.image) {
                    error.image = new CommonImage();
                    if (error.rawImageFile) {
                        error.image.name = error.rawImageFile.name;
                    }
                }
                this.handleError(CommonImageError.CannotOpen, error.image);
            } else if (CommonImageError.CannotOpenPDF === error.errorCode) {
                this.handleError(CommonImageError.CannotOpenPDF, error.image);
            } else {
                throw error;
            }
        }
    }

    handleError(error: CommonImageError, image?: CommonImage) {
        if (!image) {
            image = new CommonImage();
        }
        // just add the error to mspImage
        image.error = error;

        this.errorDocument.emit(image);
    }

    /**
     * Reset input fields so that user can delete a file and
     * immediately upload that file again.
     */
    resetInputFields() {
        // let brosweFileInputElement = this.browseFileRef.nativeElement;
        // let captureFileInputElement = this.captureFileRef.nativeElement;
        this.browseFileRef.nativeElement.value = '';
        // this.captureFileRef.nativeElement.value = '';
    }

    deleteImage(image: CommonImage) {
        this.resetInputFields();
        this.images = this.images.filter(x => x.uuid !== image.uuid);
        this.imagesChange.emit(this.images);

        // If there are no images yet, we have to reset the input so it triggers 'required'.
        if ( this.required && this.images.length <= 0 ) {
            this.fileControl.setErrors({ required: true });
        }
    }

    /**
     * Return true if the image size is within range
     * @param file
     */
    checkImageDimensions(file: CommonImage): boolean {
        if (file.naturalHeight < 0 ||
            file.naturalWidth < 0 ) {
            return false;
        }
        return true;
    }

    isValid(): boolean {
        if (this.required) {
            return this.images && this.images.length > 0;
        }
        return true;
    }

}

