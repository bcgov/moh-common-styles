# [Unreleased](https://github.com/bcgov/moh-common-styles/compare/v0.0.30...95f2a31) "moh-common-lib" (2019-05-07)


### Bug Fixes

* **AddressComponent:** Include Typeahead module necessary to compile. ([7d2e7cd](https://github.com/bcgov/moh-common-styles/commit/7d2e7cd))


### Features

* **AddressComponent:** Create AddressComponent copied from prime-web. ([238c01d](https://github.com/bcgov/moh-common-styles/commit/238c01d))
* **AddressComponent:** Implement NG_VALUE_ACCESSOR for reactive forms. ([8d79d30](https://github.com/bcgov/moh-common-styles/commit/8d79d30))
* **E2E:** Create AbstractTestPage in moh-common-lib/e2e ([95f2a31](https://github.com/bcgov/moh-common-styles/commit/95f2a31))



## [0.0.30](https://github.com/bcgov/moh-common-styles/compare/v0.0.29...v0.0.30) "moh-common-lib" (2019-04-25)


### Bug Fixes

* **Datepicker:** Name attr is always unique thanks to UUID ([1ea543d](https://github.com/bcgov/moh-common-styles/commit/1ea543d))



## [0.0.29](https://github.com/bcgov/moh-common-styles/compare/v0.0.28...v0.0.29) "moh-common-lib" (2019-04-17)


### Bug Fixes

* **PostalCodeComponent:** Placeholder default fixed, changed to [@Input](https://github.com/Input)() ([67c4797](https://github.com/bcgov/moh-common-styles/commit/67c4797))



## [0.0.28](https://github.com/bcgov/moh-common-styles/compare/v0.0.27...v0.0.28) "moh-common-lib" (2019-04-16)


### Features

* **PostalCode:** Add 'maxlen' attribute when not using mask ([532a3ec](https://github.com/bcgov/moh-common-styles/commit/532a3ec))



## [0.0.27](https://github.com/bcgov/moh-common-styles/compare/v0.0.26...v0.0.27) "moh-common-lib" (2019-04-16)


### Features

* **Datepicker:** Implement NG_VALUE_ACCESSOR handlers and remove logs ([cb65dc6](https://github.com/bcgov/moh-common-styles/commit/cb65dc6))



## [0.0.26](https://github.com/bcgov/moh-common-styles/compare/v0.0.25...v0.0.26) "moh-common-lib" (2019-04-16)


### Features

* **Datepicker:** *experimental* Add NG_VALUE_ACCESSOR into DatePicker ([f603e99](https://github.com/bcgov/moh-common-styles/commit/f603e99))



## [0.0.25](https://github.com/bcgov/moh-common-styles/compare/v0.0.24...v0.0.25) "moh-common-lib" (2019-04-12)


### Bug Fixes

* **FileUploaderComponent:** Fix runtime issue with missing reference ([a9cafca](https://github.com/bcgov/moh-common-styles/commit/a9cafca))



## [0.0.24](https://github.com/bcgov/moh-common-styles/compare/v0.0.23...v0.0.24) "moh-common-lib" (2019-04-10)


### Bug Fixes

* **CommonLogger:** Commmon Logger now can be used with application-defined interfaces. ([4766a2b](https://github.com/bcgov/moh-common-styles/commit/4766a2b))



## [0.0.23](https://github.com/bcgov/moh-common-styles/compare/v0.0.22...v0.0.23) "moh-common-lib" (2019-04-10)


### Features

* **CommonLogger:** CommonLogger is exported from moh-common-lib/services ([85eab15](https://github.com/bcgov/moh-common-styles/commit/85eab15))



## [0.0.22](https://github.com/bcgov/moh-common-styles/compare/v0.0.21...v0.0.22) "moh-common-lib" (2019-04-08)


### Bug Fixes

* **postal-code-component:** Postal Code Component Validation made to match FPC. ([3d0a6bc](https://github.com/bcgov/moh-common-styles/commit/3d0a6bc))



## [0.0.21](https://github.com/bcgov/moh-common-styles/compare/v0.0.20...v0.0.21) "moh-common-lib" (2019-04-02)


### Build

* Update build scripts and commit hooks. ([ca8bd7c](https://github.com/bcgov/moh-common-styles/commit/ca8bd7c))
* **changelog:** Improve changelog generation, adding new categories ([d5bf00b](https://github.com/bcgov/moh-common-styles/commit/d5bf00b))
* **package.json:** npm scripts for version should now build and package docs. ([3ac6d4d](https://github.com/bcgov/moh-common-styles/commit/3ac6d4d))


### Documentation

* **contributing:** CONTRIBUTING.MD includes instructions on git hooks ([c6befdf](https://github.com/bcgov/moh-common-styles/commit/c6befdf))


### Features

* **ToggleComponent:** Import ToggleComponent from FPC ([df26aa1](https://github.com/bcgov/moh-common-styles/commit/df26aa1))



## [0.0.20](https://github.com/bcgov/moh-common-styles/compare/v0.0.19...v0.0.20) "moh-common-lib" (2019-04-01)


### Bug Fixes

* Move WizardProgressItem to moh-common-lib/models and export ([7fd6537](https://github.com/bcgov/moh-common-styles/commit/7fd6537))
* **build:** Refactor SimpleDate location but keep same public export API ([7eaf326](https://github.com/bcgov/moh-common-styles/commit/7eaf326))
* **build:** Refactor SimpleDate location but keep same public export API ([d5f44c4](https://github.com/bcgov/moh-common-styles/commit/d5f44c4))


### Features

* **build:** Add `npm run clean` command to rimraf dist folders ([65b8144](https://github.com/bcgov/moh-common-styles/commit/65b8144))
* **build:** Auto-add githooks after running npm install. ([3b90e60](https://github.com/bcgov/moh-common-styles/commit/3b90e60))



## [0.0.19](https://github.com/bcgov/moh-common-styles/compare/v0.0.18...v0.0.19) "moh-common-lib" (2019-03-28)


### Bug Fixes

* **file-uploader:** Images array will be initialized if not provided ([4e8eb9b](https://github.com/bcgov/moh-common-styles/commit/4e8eb9b))


### Features

* **component:** Create DropdownComponent ([7f968a4](https://github.com/bcgov/moh-common-styles/commit/7f968a4))
* **components:** PasswordComponent emits on blur; page-section imported. ([dbb94e1](https://github.com/bcgov/moh-common-styles/commit/dbb94e1))



## [0.0.18](https://github.com/bcgov/moh-common-styles/compare/v0.0.17...v0.0.18) "moh-common-lib" (2019-03-28)


### Features

* **captcha:** CaptchaModule successfully configured. ([e762fc1](https://github.com/bcgov/moh-common-styles/commit/e762fc1))



## [0.0.17](https://github.com/bcgov/moh-common-styles/compare/48dfa9d...v0.0.17) "moh-common-lib" (2019-03-28)


### Bug Fixes

* **captcha:** Fix compile time bug in CAPTCHA ([6caf36c](https://github.com/bcgov/moh-common-styles/commit/6caf36c))
* **changelog:** Truncate duplicate sections in CHANGELOG.md ([c054ca5](https://github.com/bcgov/moh-common-styles/commit/c054ca5))
* **component:** FileUploader required properly flags on return ([6242bea](https://github.com/bcgov/moh-common-styles/commit/6242bea))
* **docs:** Rename documentation/ to docs/ ([650025e](https://github.com/bcgov/moh-common-styles/commit/650025e))
* **schematics:** moh-start schematic sets skipLibCheck=false in tsconfig ([48dfa9d](https://github.com/bcgov/moh-common-styles/commit/48dfa9d))
* **security:** Fixed issues from npm audit. ([479804f](https://github.com/bcgov/moh-common-styles/commit/479804f))


### Build

* **packaging:** Release tagging, auto-version increment, and changelog. ([8a22405](https://github.com/bcgov/moh-common-styles/commit/8a22405))
* **packaging:** Update build scripts for changelog and commit hooks ([aee4761](https://github.com/bcgov/moh-common-styles/commit/aee4761))
* Change changelog generation and commit ([48966c0](https://github.com/bcgov/moh-common-styles/commit/48966c0))


### Documentation

* **lib:** Generate first docs, update pageframework jsdocs ([bf3cf23](https://github.com/bcgov/moh-common-styles/commit/bf3cf23))
* Add Getting Started and update main readme ([2c5c994](https://github.com/bcgov/moh-common-styles/commit/2c5c994))
* Create local-development subfolder of markdown files ([2625608](https://github.com/bcgov/moh-common-styles/commit/2625608))
* Re-generate docs after updating PasswordComponent ([017bd5f](https://github.com/bcgov/moh-common-styles/commit/017bd5f))
* Update link to issues instead of PR ([4b884a6](https://github.com/bcgov/moh-common-styles/commit/4b884a6))
* Update readme to absolute paths to GitHub pages ([8004583](https://github.com/bcgov/moh-common-styles/commit/8004583))


### Features

* **build:** Create "setup:git-hooks" npm script ([1a288cd](https://github.com/bcgov/moh-common-styles/commit/1a288cd))
* **captcha:** CaptchaModule properly configured so docs are now correct. ([35d0bba](https://github.com/bcgov/moh-common-styles/commit/35d0bba))
* **component:** Create common-dropdown component ([01d17d3](https://github.com/bcgov/moh-common-styles/commit/01d17d3))
* **components:** Add 'form-bar' CSS class to both form bars ([6d5649d](https://github.com/bcgov/moh-common-styles/commit/6d5649d))
* **docs:** Create docs config file, .compodoccrc.json ([c8cd6f4](https://github.com/bcgov/moh-common-styles/commit/c8cd6f4))



