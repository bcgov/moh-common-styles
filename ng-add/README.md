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

[ ] Making changes to schematic + re-compiling