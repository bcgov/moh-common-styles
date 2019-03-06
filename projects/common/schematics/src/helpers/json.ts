import {Tree} from '@angular-devkit/schematics';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
export function sortObjectByKeys(obj: object) {
    return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
  }

export function modifyJSON(host: Tree, fileName: string, transformFn: (json: JSON) => string | JSON ): Tree {

    if (host.exists(fileName)) {
        const sourceText = host.read(fileName)!.toString('utf-8');
        const json = JSON.parse(sourceText);
        const newJSON = transformFn(json);

        host.overwrite(fileName, JSON.stringify(newJSON, null, 2));
    }

    return host;
}
