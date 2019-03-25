# MoH Common Styles

## Documentation

Documentation: https://bcgov.github.io/moh-common-styles/index.html

## Requirements

* node (using 8.9.4, but older versions may be compatible)
* npm (6.4.1, but older versions may be compatible)

## Installation

    npm install --save moh-common-lib


## Setup (Shared Components)

To setup the shared components:



    import { SharedCoreModule } from 'moh-common-lib';


    @NgModule({
        declarations: [ ... ],
        providers: [ ... ],
        imports: [
            ...
            SharedCoreModule
        ]
    })

You can read more at the [Getting Started Guide](https://bcgov.github.io/moh-common-styles/additional-documentation/getting-started.html)


## Feedback, Mistakes, and Pull Requests

This library and the documentation are still very young and there are bound to be growing pains. The only way I can fix them is if you let 

If you find any mistakes with either this documentation or the underlying library please submit an [Issue on GitHub](https://github.com/bcgov/moh-common-styles/issues). If, you can come ask me, Adam Coard, in person or drop me an email.

