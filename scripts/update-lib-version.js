/**
 * This file is responsible for keeping `version` in package.json and in
 * /common/package.json in sync.
 */

const mainPackageJson = require('../package.json');
const glob = require('glob');
const fs = require('fs');

glob.sync('./projects/common/package.json')
   .forEach(location =>
      fs.writeFileSync(location, JSON.stringify({
         ...JSON.parse(fs.readFileSync(location)),
         version: mainPackageJson.version
      }, null, 3))
   );