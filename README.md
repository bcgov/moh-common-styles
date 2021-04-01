# MoH Common Styles
![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)

## Documentation

[Documentation - https://bcgov.github.io/moh-common-styles/](https://bcgov.github.io/moh-common-styles/index.html)

## Requirements

* node@>=10.24.0
* npm@>=8.0.0, @<10.0.0

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

This library and the documentation are still very young and there are bound to be growing pains.

If you find any mistakes with either this documentation or the underlying library please submit an [Issue on GitHub](https://github.com/bcgov/moh-common-styles/issues). Or if you're able you can ask me in person.  Thanks

\- _Adam Coard_

