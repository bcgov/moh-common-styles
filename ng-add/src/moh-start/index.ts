import { Rule, SchematicContext, Tree, move, apply, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import {addPackageToPackageJson, sortObjectByKeys} from './package-config';
import { stylesSCSS } from './files/styles';
import { appComponentHtml } from './files/app_component_html';
import { variableScss } from './files/variables_scss';
import { overridesScss } from './files/overrides_scss';

import { MyriadWebProTTF_base64 } from './files/MyriadWebPro_ttf_base64';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function mohStart(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    addPackageToPackageJson(tree, 'mygovbc-bootstrap-theme', '^0.4.0');
    addPackageToPackageJson(tree, 'font-awesome', '^4.6.3');
    addPackageToPackageJson(tree, "bootstrap", "^4.0.0");
    //currently there's a bug with rxjs@6.4.0, so we hardlock version. can be removed in future.
    addPackageToPackageJson(tree, "rxjs", "6.2.1", true);

    // Update files
    overwriteFile(tree, 'src/styles.scss', stylesSCSS);
    overwriteFile(tree, 'src/app/app.component.html', appComponentHtml);

    // Add new files
    createIfMissing(tree, 'src/app/styles/variables.scss', variableScss);
    createIfMissing(tree, 'src/app/styles/overrides.scss', overridesScss);
    const font = Buffer.from(MyriadWebProTTF_base64, 'base64');
    createIfMissing(tree, 'src/app/fonts/MyriadWebPro.ttf', font);

    // Update style imports in angular.json
    updateAngularJson(tree);

    

    // Copy over files

    // TODO - Basic homepage w/ styles (will be updated to use page framework/templates, but those aren't setup yet)
    // TODO - package.json scripts (including version.js)


    // TODO - Manually copy over openShift folder for PRIME
    // TODO (optional) trigger an `npm install`

    // TODO - Get it to auto-load in moh-common-styles as a shared dependency

    installPackageJsonDependencies();

    return tree;
  };
}

/** Use a string to overwrite a file. Checks to make sure file does not have content. */
export function overwriteFile(host: Tree, targetPath: string, content: string): Tree {

  if (host.exists(targetPath)) {
    host.overwrite(targetPath, content);
  }
  else {
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
  if (!host.exists(targetPath)){
    host.create(targetPath, content);
  }
}

function updateAngularJson(host: Tree): Tree {
  if (host.exists('angular.json')){
    const sourceText = host.read('angular.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    const projectName = Object.keys(json['projects'])[0];
    
    // json['projects'][projectName]['architect']
    json['projects'][projectName]['architect']['build']['options']['stylePreprocessorOptions'] = {
      includePaths : ["src/app/styles"]
    };

    host.overwrite('angular.json', JSON.stringify(json, null, 2));
  }

  return host;
}