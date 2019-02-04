import { Rule, SchematicContext, Tree, move, apply, url } from '@angular-devkit/schematics';

import {addPackageToPackageJson, sortObjectByKeys} from './package-config';
import { template } from '@angular-devkit/core';
import { readFile, readFileSync, readdirSync } from 'fs';
import { stylesSCSS } from './files/styles';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function mohStart(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    addPackageToPackageJson(tree, 'mygovbc-bootstrap-theme', '^0.4.0');
    addPackageToPackageJson(tree, 'font-awesome', '^4.6.3');

    updateStyles(tree);


    // TODO - Setup styles.scss - create template file and use as basis (w/o interpolation)
    // TODO - Basic homepage w/ styles (will be updated to use page framework/templates, but those aren't setup yet)
    //TODO: Include font. Currently missing.



    // TODO (optional) trigger an `npm install`

    return tree;
  };
}

// TODO - Rename
/** Adds a package to the package.json in the given host tree. */
export function updateStyles(host: Tree): Tree {
  const STYLES_PATH = 'src/styles.scss';


  if (host.exists(STYLES_PATH)) {
    const sourceText = host.read(STYLES_PATH)!.toString('utf-8');
    const lines = sourceText.split('\n').length;
    if (lines > 5 ) {
      console.log('Styles.scss already has content, skipping overwrite.');
      return host;
    }
    host.overwrite(STYLES_PATH, stylesSCSS);
  }
  else {
    console.log('missing style.scss file, unable to run update styles');
  }

  return host;
}
