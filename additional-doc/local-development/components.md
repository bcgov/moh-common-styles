# Components

This file will help you get setup with local development for components, modules, and other importable objects. This includes local builds, but it is also a required step in order to create builds for NPM.

This does _not_ include schematics which are not imported by projects but rather ran on them or used to generate code. 

## New Project Setup + Schematics

This project has 2 main parts to it, and this readme is broken in 2 to reflect that.


1. The Library - **moh-common-lib** - relates to this project as a component library for an Angular application, to appear in the `node_modules/` folder of an Angular application
2. The Schematics - **moh-common-schematics** - relates to this project as a collection of Angular schematics and scripts to setup a whole project or files within a project. These schematics live in this project, but operate on an Angular application.

There are two different `npm links` for each of these facets.  Each one corresponds to a different package.json:

1. moh-common-lib (library) > projects/common/package.json
2. moh-common-schematics (schematics) > projects/common/schematics/package.json


For more information on schematics, look at the Schematics documentation.

### The Library


#### Building the Library

First make sure to run `npm install` prior to building, to install necessary dependencies.  You must build the library prior to using and linking in local development.

    > ng build moh-commmon-lib

If it runs well, the end of the output should show the following:

    Built moh-common-lib
    Built Angular Package!
    - from: /space/workspace/moh-common-styles/projects/common
    - to:   /space/workspace/moh-common-styles/dist/common

We can see build artifacts are created in the "to" folder. For local development, we will `npm link` directly to that folder; when publishing to npm we will publish tohse artifacts.

#### Setting up npm link for library

Oh the command line navigate to the "to" folder from above, the dist folder for the common project: `moh-common-styles/dist/common`. Then run the following command:

    > npm link

Note - the `dist/common` folder MUST have a package.json in it. The name in the package.json will be used as a reference when linking to this folder from other folders (e.g. when configuring PRIME to use this common library). In our case the name is `moh-common-lib`. Assuming all goes well you should see output at the end like this (paths may differ):

```
.../example/path.../node/v8.9.4/lib/node_modules/moh-common-lib -> /space/workspace/moh-common-styles/projects/common
```

If the folder does not exist, or is empty, make sure to build the library.


#### Setting up npm link for library

You must make sure to set `"preserveSymlinks": true` in angular.json under the project>architect>build>options.

Then navigate to the application which will consume the library, make sure you're in the same folder as that application's `package.json` (this should be the top level, e.g. `prime-web/`).  From there, run `npm link moh-common-lib`.  That's it, the build artifacts from the library will now appear in `node_modules/` and can be imported like any other library.  Now in the application you can write...

```TypeScript
import { example } from 'moh-common-lib'
```

If you've made any chanfges to the library make sure to re-build with `ng build moh-commmon-lib` from the library folder.

As for what specifically you can import from 'moh-common-lib', that is all defined in `projects/common/src/public_api.ts.`
