# MoH Common Styles

## Requirements

* node (using 8.9.4, but older versions may be compatible)
* npm (6.4.1, but older versions may be compatible)


## New Project Setup + Schematics

This project has 2 main parts to it, and this readme is broken in 2 to reflect that.


1. The Library - **moh-common-lib** - relates to this project as a component library for an Angular application, to appear in the `node_modules/` folder of an Angular application
2. The Schematics - **moh-common-schematics** - relates to this project as a collection of Angular schematics and scripts to setup a whole project or files within a project. These schematics live in this project, but operate on an Angular application.

There are two different `npm links` for each of these facets.  Each one corresponds to a different package.json:

1. moh-common-lib (library) > projects/common/package.json
2. moh-common-schematics (schematics) > projects/common/schematics/package.json



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

Then navigate to the application which will consume the library, make sure you're in the same folder as that application's `package.json` (this should be the top level, e.g. `prime-web/`).  From there, run `npm link moh-common-lib`.  That's it, the build artifacts from the library will now appear in `node_modules/` and can be imported like any other library.  Now in the application you can write...

```TypeScript
import { example } from 'moh-common-lib'
```

If you've made any changes to the library make sure to re-build with `ng build moh-commmon-lib` from the library folder.

As for what specifically you can import from 'moh-common-lib', that is all defined in `projects/common/src/public_api.ts.`


### Schematics

#### Building & Linking Schematics

Schematics folder is `projects/common/schematics`

Author all changes to the .ts files, and then run this to build.

```bash
npm run build # compiles one time
npm run build -- -w # watches for changes and re-compiles
```

#### Creating, Linking, and Running Schematics on a New Project

First, create the new project.
```bash
ng new example --style=scss --routing=true
cd example
npm link moh-common-schematics // This name comes from the package.json above
ng g moh-common-schematics:moh-start // Part before colon comes from the above package-json, part after colon is name of specific schematic.
```



# TODO

- [x] Making changes to schematic + re-compiling (npm run build + watch command)
- [x] Include integration with upcoming moh-common-styles library
- [ ] Package.json scripts from fpc
- [ ] Trigger an npm install when done the schematic (currently not working)
- [ ] Document need for `openshift/` folder to still be manually setup
- [ ] Configurable project name, e.g. change page title.
- [ ] Split moh-start schematic into multiple schematics, de-compose them. Will make path to future 'update' calls simpler (update-scss, update-assets, update-dependencies). Moh-start should just call each of them.
- [ ] Base64 file conversion (add helper script?)


    > const favi = fs.readFileSync('favicon.ico');
    > const favi_b64 = favi.toString('base64')
    > fs.writeFileSync('favicon_ico.ts', favi_b64)

- [ ] Add momentjs as dependency to package.json
- [ ] Add NgForm and other modules to appropriate angular modules
- [ ] Authoring changes to the library and re-building (`ng build moh-common-lib` from `projects/common`)
- [ ] angular.json - add preserveSymlinks to new projects
- [ ] uncomment pollyfills.ts
- [x] resolve issue with component viewProviders, ControlContainer + ngForms for "nested" components