
import { Base } from './base';
import { format, startOfToday, differenceInYears } from 'date-fns';

/**
 * Person, each project can extend this person class
 * NPM package dependencies:
 *  a) moment
 */
export class Person extends Base {

  // Parts of a person's name
  public firstName: string;
  public middleName: string;
  public lastName: string;

  /** Format to display birthdate */
  public dobFormat = 'yyyy/MM/dd';
  public apiDobFormat = 'yyyyMMdd';

  // Initialize dob to nulls - To be removed
  public dateOfBirth: Date;

  /** Returns DoB in YYYYMMDD format, used by API. */
  get dateOfBirthShort(): string {
    return this.dateOfBirth ? format( this.dateOfBirth, this.apiDobFormat ) : null;
  }

  /** Returns DoB in dobFormat (default: YYYY/MM/DD), for display purposes */
  get formatDateOfBirth(): string {
    return this.dateOfBirth ? format( this.dateOfBirth, this.dobFormat ) : null;
  }

  /** Concatenates the first and last name together */
  get name(): string {
    let _name = null;

    if ( this.firstName ) {
      _name = this.firstName;
    }

    if ( this.lastName ) {
      _name = _name ? _name.concat( ' ' + this.lastName ) : this.lastName;
    }

    return _name;
  }

  /**
   * Sets the full name for the person (first, middle and last names)
   * NOTE: Just for development with dummy data and unit tests
   */
  set name( fullName: string ) {

    const names = fullName.split( ' ') ;
    this.firstName = names[0];

    if ( names.length === 2 ) {
      this.lastName = names[1];
    } else if ( names.length === 3 ) {
      this.middleName = names[1];
      this.lastName = names[2];
    }
  }

  /** Returns the person's full name - first middle last name concatenated together */
  get fullname() {
    let _name = null;

    if ( this.firstName ) {
      _name = this.firstName;
    }

    if ( this.middleName ) {
      _name = _name ? _name.concat( ' ' + this.middleName ) : this.middleName;
    }

    if ( this.lastName ) {
      _name = _name ? _name.concat( ' ' + this.lastName ) : this.lastName;
    }

    return _name;
  }

  /** Calculates the age from date of birth */
  getAge(): number {
    return differenceInYears( this.dateOfBirth, startOfToday() );
  }

  /* Copy function */
  copy( object: Person ) {
    this.firstName = object.firstName;
    this.middleName = object.middleName;
    this.lastName = object.lastName;
    this.dateOfBirth = object.dateOfBirth;
  }
}
