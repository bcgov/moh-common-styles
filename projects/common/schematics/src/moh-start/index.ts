import { Rule, SchematicContext, Tree, move, apply, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import {addPackageToPackageJson, sortObjectByKeys} from './package-config';
import { stylesSCSS } from './files/styles';
import { appComponentHtml, appComponentCSS } from './files/app_component_html';
import { variableScss } from './files/variables_scss';
import { overridesScss } from './files/overrides_scss';

import { MyriadWebProTTF_base64 } from './files/MyriadWebPro_ttf_base64';
import { BCLogoBase64 } from './files/gov3_bc_logo_png_base64';
import { favicon_base64 } from './files/favicon_ico';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function mohStart(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    // _context.logger.info('✓ moh-start beginning...');
    addPackageToPackageJson(tree, 'mygovbc-bootstrap-theme', '^0.4.0');
    addPackageToPackageJson(tree, 'font-awesome', '^4.6.3');
    addPackageToPackageJson(tree, 'bootstrap', '^4.0.0');
    // currently there's a bug with rxjs@6.4.0, so we hardlock version. can be removed in future.
    addPackageToPackageJson(tree, 'rxjs', '6.2.1', true);
    addPackageToPackageJson(tree, '@ng-select/ng-select', '^2.16.2');


    // Update files
    overwriteFile(tree, 'src/styles.scss', stylesSCSS);
    overwriteFile(tree, 'src/app/app.component.html', appComponentHtml);
    overwriteFile(tree, 'src/app/app.component.scss', appComponentCSS);

    // Add new files
    createIfMissing(tree, 'src/app/styles/variables.scss', variableScss);
    createIfMissing(tree, 'src/app/styles/overrides.scss', overridesScss);
    const font = Buffer.from(MyriadWebProTTF_base64, 'base64');
    createIfMissing(tree, 'src/app/fonts/MyriadWebPro.ttf', font);

    const logo = Buffer.from(BCLogoBase64, 'base64');
    createIfMissing(tree, 'src/assets/gov3_bc_logo.png', logo);

    const favicon = Buffer.from(favicon_base64, 'base64');
    overwriteFile(tree, 'src/favicon.ico', favicon);

    // Update style imports in angular.json
    updateAngularJson(tree);
    updateTsConfig(tree, _context);

    // TODO - package.json scripts (including version.js)
    // TODO - Manually copy over openShift folder for PRIME

    _context.logger.info('✓ moh-start complete!');


    return tree;
  };
}

/** Use a string to overwrite a file. Checks to make sure file does not have content. */
export function overwriteFile(host: Tree, targetPath: string, content: string | Buffer): Tree {

  if (host.exists(targetPath)) {
    host.overwrite(targetPath, content);
  } else {
    console.log(`MISSING - ${targetPath}, unable to run update file`);
  }

  return host;
}

/* Trigger an npm install */
function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `Installing packages...`);

    return host;
  };
}


function createIfMissing(host: Tree, targetPath: string, content: any) {
  if (!host.exists(targetPath)) {
    host.create(targetPath, content);
  }
}

function updateAngularJson(host: Tree): Tree {
  if (host.exists('angular.json')) {
    // tslint:disable-next-line:no-non-null-assertion
    const sourceText = host.read('angular.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    const projectName = Object.keys(json['projects'])[0];

    // Set stylePreprocessorOptions to auto-include styles.scss and variables.scss
    json['projects'][projectName]['architect']['build']['options']['stylePreprocessorOptions'] = {
      includePaths : ['src/app/styles']
    };

    host.overwrite('angular.json', JSON.stringify(json, null, 2));
  }

  return host;
}

/**
 * Configures settings in tsconfig.json that are required to properly import
 * from moh-common-lib
 *
 * Specifically, skibLibCheck
 */
function updateTsConfig(host: Tree, _context: SchematicContext): Tree {

  if (host.exists('tsconfig.json')) {
    // tslint:disable-next-line:no-non-null-assertion
    const sourceText = host.read('tsconfig.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    json['compilerOptions']['skipLibCheck'] = true;

    host.overwrite('tsconfig.json', JSON.stringify(json, null, 2));
    _context.logger.info('✓ updated tsconfig.json setting skipLibCheck=true');

  }

  return host;
}

