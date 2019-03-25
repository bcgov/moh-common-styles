# Getting Started

Assumption: you've already installed moh-common-lib.

## Importing the Library (moh-common-lib)

Import components via the `SharedCoreModule`.


    import { SharedCoreModule } from 'moh-common-lib';


    @NgModule({
        declarations: [ ... ],
        providers: [ ... ],
        imports: [
            ...
            SharedCoreModule
        ]
    })


By adding this module you will automatically get access to core components, each starting with  "common-*". [View all components](../modules/SharedCoreModule.html)

This does *not* import Services, Models, and some specific components like FileUploader and Captcha. Those will be detailed below.



## Importing Dos and Don'ts

All imports from moh-common-lib should go to one of the secondary entry points listed above (e.g. `/models` or `/captcha`). You should never import from a deeper level. When auto-importing make sure to double-check the import paths because VS Code often likes to setup incorrect imports.


    // GOOD
    import { GeocoderService } from 'moh-common-lib/services';

    // BAD
    import { GeoAddressResult } from 'moh-common-lib/services/geocoder.service';

If you need access to an export and can only get it this way, let us know and we can export it properly.


## Importing a Service (moh-common-lib/services)

If a service is usable as-is, you can find them in the `Injectables` section of the documentation in the menu.

    import { GeocoderService } from 'moh-common-lib/services';


### Setting up an API Service (moh-common-lib/services)

In some cases, we provide abstract classes that provide the foundation of services you will create.   

For example, the [AbstractHTTPService](../classes/AbstractHttpService.html):

    import { AbstractHttpService } from 'moh-common-lib/services';

    @Injectable()
    export class APIService extends AbstractHTTPService {}
    // You will have to setup _headers, and handleError(), 
    // and create your own methods for each API Request using this.get() and this.post()


These Abstract classes are not injectables and as such are found under `Classes`.  The `Classes` folder section also includes other non-service classes, like models.

## Importing a Model (moh-common-lib/models)

Models are all found under `Classes`.

    import { Address } from 'moh-common-lib/models';
    const addr = new Address();

The address, and others like it, is a pure TypeScript model with no specific Angular integration. However, other components may expect an Address as an @Input.

## File Uploader classes, interfaces, etc. (moh-common-lib/images)

All classes, interfaces, and enums related to the FileUploader are all in `moh-common-lib/images`

    import { CommonImage, CommonImageError, CommonImageScaleFactorsImpl } from 'moh-common-lib/images';

This does NOT include the actual FileUploader, which is currently in the `SharedCoreModule`.

## CAPTCHA

**Note: This is still in development and may not be working**

    import { CaptchaModule } from 'moh-common-lib/captcha';

    @NgModule({
        declarations: [ ... ],
        providers: [ ... ],
        imports: [
            ...
            CaptchaModule
        ]
    })

Then register your application module and use `<common-captcha>`

