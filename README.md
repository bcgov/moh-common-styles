# MoH Common Styles

## Requirements

* node (using 8.9.4, but older versions may be compatible)
* npm (6.4.1, but older versions may be compatible)


## Setup (Shared Components)

To setup the shared components:

```
$ npm install --save moh-common-lib 
```


    import { SharedCoreModule } from 'moh-common-lib';


    @NgModule({
        declarations: [ ... ],
        providers: [ ... ],
        imports: [
            ...
            SharedCoreModule
        ]
    })

## Entry Points

