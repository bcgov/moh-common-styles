/**
 * Address class, each project can extend this address class
 */

export class Address {

  /* Variables for class */
  public street: string;
  public postal: string;
  public country: string;
  public province: string;
  public city: string;

  /** Overwrite the native JavaScript toString method to determine how the
   * object should be printed, instead of [object Object].  This provides a
   * standard way to print out an address. If you need something specific you
   * should access the properties directly. We omit Province/Country because of
   * PharmaCare's BC focus. */
  toString() {
    return `${this.street}, ${this.city}`;
  }

  /**
   * Address must have all fields filled out to be considered
   * complete
   * @returns {boolean}
   */
  isComplete(): boolean {
    // All fields have data - not empty
    return !!(this.street && this.city && this.country &&
             this.province && this.postal);
  }

  /* Copy function */
  copy(object: Address) {
    this.street = object.street;
    this.city = object.city;
    this.country = object.country;
    this.postal = object.postal;
    this.province = object.province;
  }
}




