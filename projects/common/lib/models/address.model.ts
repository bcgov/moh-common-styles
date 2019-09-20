/**
 * Address class, each project can extend this address class
 */

export class Address {

  // TODO: remove 'street' to eliminate confusion.  Possible breaking change

  static PostalCodeBCRegEx = '^[Vv]\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\\d$';

  /** Same as addressLine1, your application should use one or the other. */
  public street: string;

  /** Same as street, your application should use one or the other. */
  public addressLine1: string;
  /** Used to store optional extra address fields. Can be used with addressLine1 OR street. */
  public addressLine2: string;
  /** Used to store optional extra address fields. Can be used with addressLine1 OR street. */
  public addressLine3: string;
  public postal: string;
  public country: string;
  public province: string;
  public city: string;
  public hasValue: boolean;
  public isValid: boolean;




  /** Overwrite the native JavaScript toString method to determine how the
   * object should be printed, instead of [object Object].  This provides a
   * standard way to print out an address. If you need something specific you
   * should access the properties directly. We omit Province/Country because of
   * PharmaCare's BC focus. */
  toString() {
    return `${this.addressLine1}, ${this.city}`;
  }

  /**
   * Address must have all fields filled out to be considered
   * complete
   */
  isComplete(): boolean {
    // All fields have data - not empty
    return !!(this.street && this.city && this.country &&
             this.province && this.postal);
  }

  get isBCOnly(): boolean {
    let isValid = false;
    if (this.postal &&
      this.postal.length > 0) {
      const regEx = new RegExp(Address.PostalCodeBCRegEx);
      isValid = regEx.test(this.postal);
    }
    return isValid;
  }

  /* Copy function */
  copy(object: Address) {
    this.street = object.street;
    this.addressLine1 = object.addressLine1;
    this.addressLine2 = object.addressLine2;
    this.addressLine3 = object.addressLine3;

    this.city = object.city;
    this.country = object.country;
    this.postal = object.postal;
    this.province = object.province;
  }
}




