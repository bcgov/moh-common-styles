# MoH Common Styles

## Requirements

* node (using 8.9.4, but older versions may be compatible)
* npm (6.4.1, but older versions may be compatible)


## Writing code & compiling changes

Make sure to write all changes to .ts files, e.g. `index.ts`.  Then use npm to compile to us .d.ts, .js, and .map.js files.

```bash

npm run build # compiles one time
npm run build -- -w # watches for changes and re-compiles
```

It's important to compile the files before running any schematics, publishing to npm, etc.


## New Project Setup + Schematics

Setting up a new MoH Angular project


### Creating a new project

Create a new project with ng new and make sure to use these flags, otherwise it won't work.

`ng new <name> --style=scss --routing=true`


## The Library
TODO - Contrast this section with "The Schematics"

### Building the Library

You must build the library before you begin local development using it.  

`ng build moh-commmon-lib`

This should crate build artifacts in the `dist/` folder. For local development we will `npm link` directly to those artifacts; and we will publish those artifacts when bundling for release.

----
### Setting up npm link for schematics
On the command line navigate to the dist folder for the "common" project, `moh-common-styles/dist/common`. Then run the following command:

`npm link`

Note - this folder MUST have a package.json in it. The name in the package.json will be used as a reference when linking to this folder from other folders (e.g. when configuring PRIME to use this common library). In our case the name is `moh-common-lib`. Assuming all goes well you should see output at the end like this (paths may differ):

```
.../example/path.../node/v8.9.4/lib/node_modules/moh-common-lib -> /space/workspace/moh-common-styles/projects/common
```

If the folder does not exist, or is empty, make sure to build the library.


### Setting up npm link for library

<!-- Make sure to navigate to the `dist/common` folder and run `npm link` there. -->

Then navigate to the application which will consume the library, make sure you're in the same folder as that application's `package.json` (this should be the top level, e.g. `prime-web/`).  From there, run `npm link moh-common-lib`.  That's it, the build artifacts from the library will now appear in `node_modules/` and can be imported like any other library.  Now in the application you can write...

```TypeScript
import { example } from 'moh-common-lib'
```

If you've made any changes to the library make sure to re-build with `ng build moh-commmon-lib` from the library folder.

As for what specifically you can import from 'moh-common-lib', that is all defined in `projects/common/src/public_api.ts.`

----
### Linking New Project

First, create the new project.
```bash
ng new example --style=scss
cd example
npm link moh-start // This name comes from the package.json above
ng g moh-start:moh-start // Part before colon comes from the above package-json, part after colon is name of specific schematic.
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
- [ ] resolve issue with component viewProviders, ControlContainer + ngForms for "nested" components