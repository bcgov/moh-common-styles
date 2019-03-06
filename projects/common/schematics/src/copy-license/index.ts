import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const year = (new Date()).getFullYear();

const LICENSE = `Copyright © ${year}, Province of British Columbia, Canada.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`;


/**
 * Copies over an APACHE-2 License to the top level of a project.  This rule
 * will overwrite any pre-existing LICENSE file.
 */
export function copyLicense(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('LICENSE', LICENSE);
    _context.logger.info('✓ copied over Apache-2 License!');
    return tree;
  };
}
