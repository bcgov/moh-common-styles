import { AfterContentInit, ChangeDetectorRef, Component,
    ContentChild, ElementRef, EventEmitter, Input, NgZone, OnChanges,
    OnInit, Output, SimpleChanges, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import * as moment from 'moment';
import { ModalDirective} from 'ngx-bootstrap';
import { PDFJSStatic } from 'pdfjs-dist';
import { Observable ,  Observer, fromEvent, merge } from 'rxjs';
import {map, filter, flatMap, scan, delay, retryWhen} from 'rxjs/operators';
import { CommonImage, CommonImageError, CommonImageProcessingError,
CommonImageScaleFactors, CommonImageScaleFactorsImpl } from '../../../images/src/public_api';
// import { MspLogService } from '../../service/log.service';
// import { MspDataService } from '../../service/msp-data.service';
// import { BaseComponent } from '../base.component';
// import { LogEntry } from '../logging/log-entry.model';
// import {Person} from '../../model/application.model';
import {Router} from '@angular/router';
import { Base } from '../../../models/src/base';
// import {ApplicationBase} from '../../model/application-base.model';

// const loadImage = require('blueimp-load-image');
// const sha1 = require('sha1');

import * as loadImage_ from 'blueimp-load-image';
const loadImage = loadImage_;
import * as sha1_ from 'sha1';
const sha1 = sha1_;

// const PDFJS: PDFJSStatic = require('pdfjs-dist');
import * as PDFJS_ from 'pdfjs-dist';
const PDFJS: PDFJSStatic = (PDFJS_ as any);

export interface FileUploaderMsg {
    required: string;
}

// TODO - Remove this and fix tslint issues
/* tslint:disable:max-line-length*/

@Component({
    selector: 'common-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class FileUploaderComponent extends Base
    implements OnInit, OnChanges, AfterContentInit {
    // lang = require('./i18n');
    noIdImage: Boolean = false;
    private appConstants;
    @ViewChild('dropZone') dropZone: ElementRef;
    @ViewChild('browseFileRef') browseFileRef: ElementRef;
    // @ViewChild('captureFileRef') captureFileRef: ElementRef;
    @ViewChild('imagePlaceholderRef') imagePlaceholderRef: ElementRef;
    @ViewChild('selectFileLabel') selectFileLabelRef: ElementRef;

    // @ContentChild('uploadInstruction') uploadInstructionRef: ElementRef;
    @Input() images: Array<CommonImage> = new Array<CommonImage>(0);
    @Output() imagesChange: EventEmitter<Array<CommonImage>> = new EventEmitter<Array<CommonImage>>();
    @Input() id: string;
    @Input() showError: boolean;
    @Input() required: boolean = false;
    @Input() instructionText: string = 'Please upload required ID documents.';
    @Input() errorMessages: FileUploaderMsg = {required: 'File is required.'};

    @ViewChild('canvas') canvas: ElementRef;


    @Output() errorDocument: EventEmitter<CommonImage> = new EventEmitter<CommonImage>();

    constructor(
                // private dataService: MspDataService,
                // private logService: MspLogService,
                private zone: NgZone,
                private cd: ChangeDetectorRef , private router: Router,
                private controlContainer: ControlContainer) {
        super();
        // this.application = this.getApplicationType();
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

    /**
     * Return true if file already exists in the list; false otherwise.
     */
    static checkImageExists(file: CommonImage, imageList: Array<CommonImage>) {
        if (!imageList || imageList.length < 1) {
            return false;
        } else {

            const sha1Sum = sha1(file.fileContent);
            for (let i = imageList.length - 1; i >= 0; i--) {
                // console.log(`compare  ${imageList[i].id} with ${sha1Sum}, result ${imageList[i].id === sha1Sum}`);
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
        console.log('fileuploader onChanges', changes['images']);
        // if (changes['images'] && (changes['images'].currentValue.length === 0 &&
        //   changes['images'].previousValue.length > 0)) {
        if (changes['images'] && (
            changes['images'].currentValue.length === 0
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


        const dragOverStream =
            fromEvent<DragEvent>(this.dropZone.nativeElement, 'dragover');

        /**
         * Must cancel the dragover event in order for the drop event to work.
         */
        dragOverStream.pipe(map(evt => {
            return event;
        })).subscribe(evt => {
            // console.log('Cancel dragover event.');
            evt.preventDefault();
        });

        const dropStream = fromEvent<DragEvent>(this.dropZone.nativeElement, 'drop');
        const filesArrayFromDrop = dropStream.pipe(
            map(
                function (event) {
                    event.preventDefault();
                    return event.dataTransfer.files;
                }
            ));

        const browseFileStream = fromEvent<Event>(this.browseFileRef.nativeElement, 'change');
        // const captureFileStream = fromEvent<Event>(this.captureFileRef.nativeElement, 'change');

        merge(merge(browseFileStream).pipe(
            map(
                (event) => {
                    event.preventDefault();
                    return event.target['files'];

                }
            )),
            filesArrayFromDrop).pipe(
                filter(files => {
                    console.log('files');
                    return !!files && files.length && files.length > 0;
                }),
                flatMap(
                    (fileList: FileList) => {

                        return this.observableFromFiles(fileList, new CommonImageScaleFactorsImpl(1, 1));
                    }
                ),
                filter(
                    (mspImage: CommonImage) => {

                        const imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
                        if (imageExists) {
                            this.handleError(CommonImageError.AlreadyExists, mspImage);
                            this.resetInputFields();
                        }
                        return !imageExists;
                    }
                ),
                // TODO - Is this necessary? Can likely be removed as it's exactly identical to the preceding.
                filter((mspImage: CommonImage) => {

                    const imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
                        if (imageExists) {
                            this.handleError(CommonImageError.AlreadyExists, mspImage);
                            this.resetInputFields();
                        }
                        return !imageExists;
                    }
                ),
                filter((mspImage: CommonImage) => {

                    const imageSizeOk = this.checkImageDimensions(mspImage);
                        if (!imageSizeOk) {
                            this.handleError(CommonImageError.TooSmall, mspImage);
                            this.resetInputFields();
                        }
                        return imageSizeOk;
                    }
                )
            ).subscribe(
            (file: CommonImage) => {

                this.handleImageFile(file);
                this.resetInputFields();
            },

            (error) => {
                console.log('Error in loading image: %o', error);

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
                        this.handleError(CommonImageError.CannotOpenPDF, error.image, error.errorDescription);
                    } else {
                        throw error;
                    }
                }


            },
            () => {
                console.log('completed loading image');
            }
        );
    }

    test(var1) {
        console.log(var1);
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

        console.log('obserablveFromFiles');

        // Init
        const self = this;
    //    let  pageNumber = Math.max(...self.images.concat( self.application.getAllImages()).map(function(o) {return o.attachmentOrder; }), 0) + 1 ;
       let pageNumber = Math.max(...self.images.map(function(o) {return o.attachmentOrder; }), 0) + 1 ;

        // Create our observer
        const fileObservable = Observable.create((observer: Observer<CommonImage>) => {
            const mspImages = [];
            scaleFactors = scaleFactors.scaleDown(reductionScaleFactor);
            for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
                const file = fileList[fileIndex];
                console.log('Start processing file ' + fileIndex + ' of ' + fileList.length + ' %s of size %s bytes %s type', file.name, file.size, file.type);


                /* Previously set in appConstants */
                const pdfScaleFactor = 2.0;

                // let mspImage: MspImage = new MspImage();
                // let reader: FileReader = new FileReader();

                // // Copy file properties
                // mspImage.name = file.name;
                if (file.type === 'application/pdf') {
                    // this.logService.log({name: file.name + ' Received in Upload',
                    //     UUID: self.dataService.getMspUuid()}, 'File_Upload');

                    /**
                     *  Page number logic :
                     *      Images - Assign current page number whichever is available..so get the current page number , pass it to call back [reserve it] and increment
                     *      PDF    -  we dont know how many pages..so cant get current number and keep it since it can be multiple pages... so start assigning later point
                     *      when PDF is totally read..
                     *
                     *  */

                    this.readPDF(file, pdfScaleFactor, (images: HTMLImageElement[] , pdfFile: File) => {


                        // this.logService.log({name: file.name + 'is successfully split into ' + images.length + ' images',
                            // UUID: self.dataService.getMspUuid()}, 'File_Upload');

                        images.map((image, index) => {
                            image.name = pdfFile.name;
                            this.resizeImage( image, self, scaleFactors, observer, pageNumber , true); // index starts from zero
                            pageNumber = pageNumber + 1  ;
                        });
                    }, (error: string) => {
                        console.log('error' + JSON.stringify(error));
                        const imageReadError: CommonImageProcessingError =
                            new CommonImageProcessingError(CommonImageError.CannotOpenPDF, error);
                        observer.error(imageReadError);
                    });
                } else {
                    // Load image into img element to read natural height and width
                    this.readImage(file, pageNumber , (image: HTMLImageElement , imageFile: File , nextPageNumber: number)  => {
                            image.id = imageFile.name; // .name deprecated, changed image.name to image.id
                            this.resizeImage(image, self, scaleFactors, observer , nextPageNumber );
                        },

                        // can be ignored for bug, the log line is never called
                        (error: CommonImageProcessingError) => {
                            console.log('error' + JSON.stringify(error));
                            observer.error(error);
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
        console.log('image.name:' + image.id); // .name deprecated, changed image.name to image.id
        // Copy file properties
        mspImage.name = image.id ;
        if (isPdf) {
            mspImage.name = image.name + '-page' + pageNumber;  // Just give name to pdf
        }
        // Temporary so we don't have duplicate file names. TODO: Improve.
        //   mspImage.name += Math.ceil(Math.random()*100);
        mspImage.attachmentOrder = pageNumber ;


        mspImage.naturalWidth = image.naturalWidth;
        mspImage.naturalHeight = image.naturalHeight;

        console.log(`image file natural height and width:
            ${mspImage.naturalHeight} x ${mspImage.naturalWidth}`);

        // Canvas will force the change to a JPEG
        mspImage.contentType = 'image/jpeg'; // previously in appConstants

        // Scale the image by loading into a canvas

        console.log('Start scaling down the image using blueimp-load-image lib: ');
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

                        // log image info (but only for the first time before any scaling)
                        // if (s

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

                        console.log(`File ${fileName} is scaled down to: ${sOutput}`);
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

                                console.log('File size after scaling down: %d, max file size allowed: %d',
                                    mspImage.size, maxSizeBytes);

                                const imageTooBigError: CommonImageProcessingError =
                                    new CommonImageProcessingError(CommonImageError.TooBig);

                                imageTooBigError.maxSizeAllowed = maxSizeBytes;
                                imageTooBigError.commonImage = mspImage;

                                observer.error(imageTooBigError);
                            } else {
                                // log image info
                                //   self.logImageInfo("msp_file-uploader_after_resize_attributes", self.dataService.getMspUuid(), mspImage);
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
                    // console.log('Error encountered: %o', error);;

                    /**
                     * If the error is about file too big and we have not reach max retry
                     * yet, theyt keep going to scaling down.
                     */
                    if (acc < maxRetry && error.errorCode === CommonImageError.TooBig) {
                        // console.log('Progressively scaling down the image, step %d.', index);
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
                        console.log('Re-throw this image process error: %o', error);
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

            console.log('loading image into an img tag: %o', progressEvt);
            // Load into an image element
            const imgEl: HTMLImageElement = document.createElement('img');
            imgEl.src = (reader.result as string);

            // Wait for onload so all properties are populated
            imgEl.onload = (args) => {
                console.log('Completed image loading into an img tag: %o', args);
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
            PDFJS.getDocument((docInitParams as any)).then((pdfdoc) => {
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

                        page.render(renderContext).then(function () {
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
        console.log('image size (bytes) after compression: ' + mspImage.size);
        if (this.images.length >= 50) {

            // log it
            // this.logImageInfo('msp_file-uploader_error', this.dataService.getMspUuid(),
            //     mspImage, `Number of image files exceeds max of ${50}`);

            // log to console
            console.log(`Max number of image file you can upload is ${50}.
      This file ${mspImage.name} was not uploaded.`);
        } else {
            this.images.push(mspImage);
            this.imagesChange.emit(this.images);
            this.showError = false;
            this.noIdImage = false;
        }
    }

    handleError(error: CommonImageError, mspImage: CommonImage, errorDescription?: string) {

        if (!mspImage) {
            mspImage = new CommonImage();
        }
        // just add the error to mspImage
        mspImage.error = error;

        // log the error
        if (error !== CommonImageError.PDFnotSupported) {
            // this.logImageInfo('msp_file-uploader_error', this.dataService.getMspUuid(), mspImage,
            //     '  mspImageFile: ' + mspImage.name + '  mspErrorNum: ' + error + '  mspError: ' +
            //     error + '-' + errorDescription);
        }

        // console.log("error with image: ", mspImage);
        this.errorDocument.emit(mspImage);
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

    deleteImage(mspImage: CommonImage) {
        this.resetInputFields();
        this.images = this.images.filter(x => x.uuid !== mspImage.uuid);
        this.imagesChange.emit(this.images);

        // If there are no images yet, we have to reset the input so it triggers 'required'.
        if ( this.required && this.images.length <= 0 ) {
            console.log('No images, resetting input');
            // this.fileControl.value = '';
            this.fileControl.setErrors({'required': true});
        }
    }

    /**
     * Log image attributes
     * @param mspImage
     */
    private logImageInfo(title: string, applicationId: string, mspImage: CommonImage, additionalInfo?: string) {

        // TODO!
        // // create log entry
        // const log: LogEntry = new LogEntry();
        // log.applicationId = applicationId;
        // const now = moment();
        // log.mspTimestamp = now.toISOString();
        // log.applicationPhase = title + ':  mspImageId: ' + mspImage.id
        //     + '  mspImageUuid: ' + mspImage.uuid
        //     + '  mspImageSize: ' + mspImage.size
        //     + '  mspImageWidth: ' + mspImage.naturalWidth
        //     + '  mspImageHeight: ' + mspImage.naturalHeight
        //     + '  mspImageContentType: ' + mspImage.contentType
        //     + (additionalInfo ? '  ' + additionalInfo : '');

        // // send it while subscribing to response
        // this.logService.logIt(log, title).subscribe(
        //     (response) => {
        //         // console.log('log rest service response: ');
        //         // console.log(response);
        //     },
        //     (error) => {
        //         console.log('HTTP error response from logging service: ');
        //         console.log(error);
        //     },
        //     () => {
        //         // console.log('log rest service completed!');
        //     }
        // );
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
        console.log('isValid', this.images);
        if (this.required) {
            return this.images && this.images.length > 0;
        }
        return true;
    }

}

