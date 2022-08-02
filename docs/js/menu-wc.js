'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">moh-common-lib</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/getting-started.html" data-type="entity-link" data-context-id="additional">Getting Started</a>
                                    </li>
                                    <li class="chapter inner">
                                        <a data-type="chapter-link" href="additional-documentation/local-development.html" data-context-id="additional">
                                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#additional-page-72c2cbf9739dad90f02e23b1c853f008"' : 'data-target="#xs-additional-page-72c2cbf9739dad90f02e23b1c853f008"' }>
                                                <span class="link-name">Local Development</span>
                                                <span class="icon ion-ios-arrow-down"></span>
                                            </div>
                                        </a>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="additional-page-72c2cbf9739dad90f02e23b1c853f008"' : 'id="xs-additional-page-72c2cbf9739dad90f02e23b1c853f008"' }>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/local-development/schematics.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Schematics</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/local-development/components.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Components</a>
                                            </li>
                                        </ul>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-up"></span>
                            </div>
                        </a>
                        <ul class="links collapse in" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/CaptchaModule.html" data-type="entity-link">CaptchaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' : 'data-target="#xs-components-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-up"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' :
                                            'id="xs-components-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' }>
                                            <li class="link">
                                                <a href="components/CaptchaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CaptchaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' : 'data-target="#xs-injectables-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' :
                                        'id="xs-injectables-links-module-CaptchaModule-2d1a8728bd02b3e5854b857daded0fad"' }>
                                        <li class="link">
                                            <a href="injectables/CaptchaDataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CaptchaDataService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReCaptchaModule.html" data-type="entity-link">ReCaptchaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' : 'data-target="#xs-components-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-up"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' :
                                            'id="xs-components-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' }>
                                            <li class="link">
                                                <a href="components/RecaptchaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RecaptchaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' : 'data-target="#xs-injectables-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' :
                                        'id="xs-injectables-links-module-ReCaptchaModule-da47f9f5e2f816518feadad0a2f0d5ef"' }>
                                        <li class="link">
                                            <a href="injectables/RecaptchaDataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RecaptchaDataService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedCoreModule.html" data-type="entity-link">SharedCoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' : 'data-target="#xs-components-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-up"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' :
                                            'id="xs-components-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' }>
                                            <li class="link">
                                                <a href="components/AccordionCommonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccordionCommonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddressComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddressValidatorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddressValidatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonGroupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ButtonGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CheckboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CityComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CityComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmTemplateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmTemplateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsentModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsentModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoreBreadcrumbComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoreBreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CountryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CountryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatepickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatepickerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DropdownComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropdownComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FileUploaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FileUploaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormActionBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormActionBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormSubmitBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormSubmitBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FullNameComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FullNameComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GeocoderInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeocoderInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NameComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NameComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageFrameworkComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageFrameworkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageSectionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageSectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhnComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PhnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhoneNumberComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PhoneNumberComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostalCodeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostalCodeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProvinceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProvinceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SampleModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SampleModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SinComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SinComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StreetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StreetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThumbnailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ThumbnailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToggleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToggleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WizardProgressBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WizardProgressBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/XiconButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">XiconButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' : 'data-target="#xs-directives-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' :
                                        'id="xs-directives-links-module-SharedCoreModule-88fa367b53db54a644ac5a376f07b5a8"' }>
                                        <li class="link">
                                            <a href="directives/DateFieldFormatDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateFieldFormatDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DuplicateCheckDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DuplicateCheckDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidateBcPostalDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateBcPostalDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidateCityDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateCityDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidateNameDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateNameDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidatePostalcodeDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidatePostalcodeDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidateRegionDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateRegionDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ValidateStreetDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateStreetDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractBaseForm.html" data-type="entity-link">AbstractBaseForm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractForm.html" data-type="entity-link">AbstractForm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractFormControl.html" data-type="entity-link">AbstractFormControl</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractHttpService.html" data-type="entity-link">AbstractHttpService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractReactForm.html" data-type="entity-link">AbstractReactForm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractTestPage.html" data-type="entity-link">AbstractTestPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/Base.html" data-type="entity-link">Base</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonImage.html" data-type="entity-link">CommonImage</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonImageProcessingError.html" data-type="entity-link">CommonImageProcessingError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonImageScaleFactorsImpl.html" data-type="entity-link">CommonImageScaleFactorsImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/Container.html" data-type="entity-link">Container</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoHCommonLibraryError.html" data-type="entity-link">MoHCommonLibraryError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person.html" data-type="entity-link">Person</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AbstractPageGuardService.html" data-type="entity-link">AbstractPageGuardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AbstractPgCheckService.html" data-type="entity-link">AbstractPgCheckService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CaptchaDataService.html" data-type="entity-link">CaptchaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CheckCompleteBaseService.html" data-type="entity-link">CheckCompleteBaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonLogger.html" data-type="entity-link">CommonLogger</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContainerService.html" data-type="entity-link">ContainerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DefaultPageGuardService.html" data-type="entity-link">DefaultPageGuardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GeocoderService.html" data-type="entity-link">GeocoderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PageStateService.html" data-type="entity-link">PageStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecaptchaDataService.html" data-type="entity-link">RecaptchaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServerPayload.html" data-type="entity-link">ServerPayload</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServerPayload-1.html" data-type="entity-link">ServerPayload</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/LoadPageGuardService.html" data-type="entity-link">LoadPageGuardService</a>
                            </li>
                            <li class="link">
                                <a href="guards/RouteGuardService.html" data-type="entity-link">RouteGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddressResult.html" data-type="entity-link">AddressResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddrLabelList.html" data-type="entity-link">AddrLabelList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonAttachmentJson.html" data-type="entity-link">CommonAttachmentJson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonImageScaleFactors.html" data-type="entity-link">CommonImageScaleFactors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonLogMessage.html" data-type="entity-link">CommonLogMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CountryList.html" data-type="entity-link">CountryList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DateErrorMsg.html" data-type="entity-link">DateErrorMsg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorMessage.html" data-type="entity-link">ErrorMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploaderMsg.html" data-type="entity-link">FileUploaderMsg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FullNameErrorMsg.html" data-type="entity-link">FullNameErrorMsg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoAddressResult.html" data-type="entity-link">GeoAddressResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRadioItems.html" data-type="entity-link">IRadioItems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISpaEnvResponse.html" data-type="entity-link">ISpaEnvResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Maxlengths.html" data-type="entity-link">Maxlengths</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageList.html" data-type="entity-link">PageList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageListInterface.html" data-type="entity-link">PageListInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordErrorMsg.html" data-type="entity-link">PasswordErrorMsg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProvinceList.html" data-type="entity-link">ProvinceList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadOnlyFields.html" data-type="entity-link">ReadOnlyFields</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SampleImageInterface.html" data-type="entity-link">SampleImageInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimpleDate.html" data-type="entity-link">SimpleDate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Size.html" data-type="entity-link">Size</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WizardProgressItem.html" data-type="entity-link">WizardProgressItem</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});