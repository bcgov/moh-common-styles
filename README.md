# MoH Common Styles

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

You can read more at the [Getting Started Guide](./additional-documentation/getting-started.html)

