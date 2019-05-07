import { browser, by, element, WebElement, $$, protractor } from 'protractor';

/**
 * AbstractTestPage provides common functionality for e2e tests that make use of
 * the MoH Common Lib.  For example, `getNameComponent()` and
 * `getNameComponentVal()`  both correspond to the NameComponent.
 */
export abstract class AbstractTestPage {
  /**
   * Clicking this button should complete the page, navigate to the next one.
   * We default it to `.form-bar .submit` but you may overwrite as necessary.
   */
  public continueButton: WebElement = element(by.css('.form-bar .submit'));
  /**
   * This is the 'Skip To Content' button for Screen Readers that appears when
   * tabbed to. May be overwritten as necessary.
   */
  public skipToContentButton: WebElement = element(by.css('.skip-to-content'));

  /**
   * Every class should override this to point to the page it is testing.
   * Calling navigateTo should go to the corresponding url this page tests.   *
   *
   * Note - We encourage hardcoding all links in e2e tests and _not_ sharing a
   * constants file with the application. While this leads to more work, it
   * avoids the case where incorrect constants (e.g. a typo in a URL) pass the
   * tests.
   *
   @example
   *    return browser.get('/enrolment/profile');
   */
  abstract navigateTo(): any;

  continue() {
    this.continueButton.click();
  }

  getContinueButton() {
    return this.continueButton;
  }

  /** Scrolls down to the bottom of the page */
  scrollDown() {
    browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
  }

  clickSkipToContent() {
    this.skipToContentButton.click();
  }

  /**
   * **NameComponent** - Returns the NameComponent for an associated human
   * readable label. If the label is a duplicate it will grab the first one
   * only.
   *
   * TODO: Update to "common-name" component when it's imported from PRIME
   *
   * @param labelName Human redable label name.
   */
  async getNameComponent(labelName: string): Promise<WebElement> {
    const label = element.all(by.cssContainingText('lib-prime-name label', labelName)).first();
    return element(by.id(await label.getAttribute('for')));
  }

  /**
   * **NameComponent** - Returns the value within a given NameComponent
   *
   * TODO: Update to "common-name" component when it's imported from PRIME
   *
   * @param labelName Human readable label name
   */
  async getNameComponentVal(labelName: string): Promise<string> {
    return (await this.getNameComponent(labelName)).getAttribute('value');
  }

  formErrors() {
    return $$('[role=alert] .text-danger');
  }

  /**
   * Selects from an ng-select component. This includes DropdownComponent
   * others, like country, province, etc.
   *
   * TODO - Need to test this works! Right now just copied from GitHub with
   * minor tweaks. IDEA - Mirror getNameComponent, where we lookup via the label
   * text and use the 'for' attribute.
   *
   * @param labelId corresponds to labelForId on the <ng-select>
   * @param optionText the option we want to select
   */
  selectOption(labelId: string, optionText: string) {
    element(by.css(`ng-select[id="${labelId}"]`)).click(); // opens dropdown
    element(by.cssContainingText('span.ng-option-label', optionText)).click(); // selects option by provided text
  }

  /**
   * Works on same NgSelect components but it sends custom text instead of
   * selecting a given choice.
   * @param labelId corresponds to labelForId on the <ng-select>
   * @param data the text we want to type
   */
  typeOption(labelId: string, data: string) {
    element(by.css(`ng-select[id="${labelId}"]`)).click(); // opens dropdown
    element(by.css(`input[role="combobox"]`)).sendKeys(data); // type option
    browser.actions().sendKeys(protractor.Key.ENTER).perform(); // hit enter key
  }

  /**
   * Enter text into an input via label name.
   * @param labelId Human readable label name for a text input
   * @param text Text to enter into the input
   */
  typeText(labelId: string, text: string) {
    element(by.css(`input[ng-reflect-name^="${labelId}"]`)).sendKeys(text);
  }

  clickButton(labelId: string, value: string) {
    element(by.cssContainingText(`button[class^="${labelId}"]`, value)).click();
  }

  clickCheckBox(labelRefName: string) {
    element(by.css(`input[ng-reflect-name="${labelRefName}"]`)).click();
  }
}
