// TODO - IMPORT NECESSARY FILES
// TODO - add moh-styles package
// TODO - update this readme block

// GOAL --
// ng new <my new project>
// ng add moh-common-styles/install


import {Rule, SchematicContext, Tree, FileSystemCreateTree} from '@angular-devkit/schematics';
// import {NodePackageInstallTask, RunSchematicTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson, getPackageVersionFromPackageJson} from './package-config';
// import {Schema} from './schema';
// import {hammerjsVersion, materialVersion, requiredAngularVersionRange} from './version-names';

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @angular/material`.
 *
 * Since the Angular Material schematics depend on the schematic utility functions from the CDK,
 * we need to install the CDK before loading the schematic files that import from the CDK.
 */
export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    // Version tag of the `@angular/core` dependency that has been loaded from the `package.json`
    // of the CLI project. This tag should be preferred because all Angular dependencies should
    // have the same version tag if possible.
    // const ngCoreVersionTag = getPackageVersionFromPackageJson(host, '@angular/core');

    // In order to align the Material and CDK version with the other Angular dependencies,
    // we use tilde instead of caret. This is default for Angular dependencies in new CLI projects.
    // addPackageToPackageJson(host, '@angular/cdk', `~${materialVersion}`);
    // addPackageToPackageJson(host, '@angular/material', `~${materialVersion}`);
    addPackageToPackageJson(host, 'mygovbc-bootstrap-theme', '^0.4.0');
    // addPackageToPackageJson(host, '@angular/animations',
    //     ngCoreVersionTag || requiredAngularVersionRange);

    // if (options.gestures) {
    //   addPackageToPackageJson(host, 'hammerjs', hammerjsVersion);
    // }

    // Since the Angular Material schematics depend on the schematic utility functions from the
    // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
    // TODO - VERIFY REMOVING BELOW TWO LINES IS OKAY
    // const installTaskId = context.addTask(new NodePackageInstallTask());
    // context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
  };
}