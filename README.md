# MoH Common Styles


## New Project Setup + Schematics

<!-- 
In common lib:

`npm link`

In new/target repo:

`npm link <name>`  note - name will be the name in package.json from the common lib

ng g <name>:moh-start -->

### Creating a new project

Create a new project with ng new and make sure to use these flags, otherwise it won't work.

`ng new <name> --style=scss --routing=true`


----
### Setting up npm link in common styles
In common styles folder (that has package.json)
`npm link`

Note - the name in the package.json here will be used as a destination name when linking from other folders

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

- [ ] Making changes to schematic + re-compiling (npm run build + watch command)
- [ ] Include integration with upcoming moh-common-styles library
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