# Schematics

## Requirements

* node (using 8.9.4, but older versions may be compatible)
* npm (6.4.1, but older versions may be compatible)


## Writing code & compiling changes

Make sure to write all changes to .ts files, e.g. `index.ts`.   The schematics folder, and all schemtaics, must be in `projects/common/schematics`


```bash

npm run build # compiles one time - must be run in schematics folder
npm run build -- -w # watches for changes and re-compiles - in schematics folder
npm run build:schematics # helper command - can be run anywhere in project, even top level
```

Then use the above to compile to .d.ts, .js, and .map.js files. It's important to compile the files before running any schematics either locally or before publishing to npm, etc. 

Unsure: Potentially you may need to run `npm instal` prior to your first build.

#### Linking Schematics

Linking schematics only has to be done once. You'll only have to do it again if you move this folder.

We have to link from the `projects/common/schematics` folder. You can tell it's the correct folder because it has `package.json` in it.

```bash
cd moh-common-styles/projects/common/schematics
npm link # creates moh-common-schematics link, name from package.json
```



#### Creating a new project and running schematics

```bash
ng new example --style=scss --routing=true // both params required
npm link moh-common-schematics # creates a symlink to the schematics folder above
ng g moh-common-schematics:moh-start # runs the schematic
```


#### Creating a new schematic

First, you must make sure the schematics-cli is installed on your machine.

```bash
npm install -g @angular-devkit/schematics-cli
```

To create a new schematic, make sure to run the command from the right folder.  It should be in the same folder as the `moh-common-schematics` package.json. `projects/common/schematics`

```bash
cd projects/common/schematics
schematics blank  --name=schematic-name-example
```

# TODO

- [ ] *High Priority* Fix compilation errors when lodaing moh-common-lib (WizardProgressBar) in moh-start by adding to tsconfig:

        "typeRoots": [ "../node_modules/@types" ],
        "skipLibCheck": true
        
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
