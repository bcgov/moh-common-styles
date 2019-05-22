/**
 * Address class, each project can extend this address class
 */

export class Address {

  /* Variables for class */
  public street: string;
  public addressLine1: string;
  public addressLine2: string;
  public addressLine3: string;
  public postal: string;
  public country: string;
  public province: string;
  public city: string;


  static PostalCodeBCRegEx = '^[Vv]\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\\d$';


  /** Overwrite the native JavaScript toString method to determine how the
   * object should be printed, instead of [object Object].  This provides a
   * standard way to print out an address. If you need something specific you
   * should access the properties directly. We omit Province/Country because of
   * PharmaCare's BC focus. */
  toString() {
    return `${this.street}, ${this.city}`;
  }

  hasValue: boolean;
  /*{
    return (this.addressLine1 != null);
  }*/


  /**
   * Address must have all fields filled out to be considered
   * complete
   */
  isValid: boolean; /* {
    // All fields have data - not empty
    return !!(this.street && this.city && this.country &&
             this.province && this.postal);
  }*/

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




