// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
// Note: Unit tests that have been started (not completed)
// const context = require.context('./lib/components/city', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/date', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/email', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/phn', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/phone-number', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/province', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/radio', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/sin', true, /\.spec\.ts$/);
// const context = require.context('./lib/components/street', true, /\.spec\.ts$/);

const context = require.context('./lib/services', true, /\.spec\.ts$/);


// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
