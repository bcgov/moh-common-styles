# Schematics

This file will help you get setup with building and running schematics. This is not necessary for publishing NPM builds of components, but is relevant if you wish to use these schematics for code-generation.

## Writing code & compiling changes

Make sure to write all changes to .ts files, e.g. `index.ts`.   The schematics folder, and all schemtaics, must be in `projects/common/schematics`


        npm run build # compiles one time - must be run in schematics folder
        npm run build -- -w # watches for changes and re-compiles - in schematics folder
        npm run build:schematics # helper command - can be run anywhere in project, even top level

Then use the above to compile to .d.ts, .js, and .map.js files. It's important to compile the files before running any schematics either locally or before publishing to npm, etc. 

Unsure: Potentially you may need to run `npm install` prior to your first build.

#### Linking Schematics

Linking schematics only has to be done once. You'll only have to do it again if you move this folder.

We have to link from the `projects/common/schematics` folder. You can tell it's the correct folder because it has `package.json` in it.

        cd moh-common-styles/projects/common/schematics
        npm link # creates moh-common-schematics link, name from package.json



#### Creating a new project and running schematics

        ng new example --style=scss --routing=true // both params required
        npm link moh-common-schematics # creates a symlink to the schematics folder above
        ng g moh-common-schematics:moh-start # runs the schematic


#### Creating a new schematic

First, you must make sure the schematics-cli is installed on your machine.

        npm install -g @angular-devkit/schematics-cli

To create a new schematic, make sure to run the command from the right folder.  It should be in the same folder as the `moh-common-schematics` package.json. `projects/common/schematics`

        cd projects/common/schematics
        schematics blank  --name=schematic-name-example

# TODO

- [X] ~~**High Priority* Fix compilation errors when lodaing moh-common-lib (WizardProgressBar) in moh-start by adding to tsconfig:*~~ [2019-03-06]

        "typeRoots": [ "../node_modules/@types" ],
        "skipLibCheck": true
        
- [x] Making changes to schematic + re-compiling (npm run build + watch command)
- [x] Include integration with upcoming moh-common-styles library
- [x] resolve issue with component viewProviders, ControlContainer + ngForms for "nested" components
- [ ] uncomment pollyfills.ts
- [ ] Package.json scripts from fpc (e.g. version, preversion)
- [ ] Document need for `openshift/` folder to still be manually setup
- [ ] Configurable project name, e.g. change page title.
- [ ] Split moh-start schematic into multiple schematics, de-compose them. Will make path to future 'update' calls simpler (update-scss, update-assets, update-dependencies). Moh-start should just call each of them.
- [ ] Convert moh-start to use templates instead of base64 encoding (like version-js does)
- [ ] Add momentjs as dependency to package.json
- [ ] Add NgForm and other modules to appropriate angular modules
- [ ] angular.json - add preserveSymlinks to new projects
