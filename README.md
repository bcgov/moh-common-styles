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


----
### Setting up npm link for schematics
In common styles folder (that has package.json)
`npm link`

Note - the name in the package.json here will be used as a destination name when linking from other folders

### Setting up npm link for library

Make sure to navigate to the `dist/common` folder and run `npm link` there.

Then navigate to the application which will consume the library, make sure you're in the same folder as that application's `package.json`.  From there, run `npm link moh-common-lib`.  That's it.  Now in the application you can write...

```TypeScript
import { example } from 'moh-common-lib'
```

If you've made any changes to the library make sure to re-build with `ng build moh-commmon-lib` from the `projects/common` folder.

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