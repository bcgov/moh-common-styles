import { SimpleDate } from '../interfaces/simple-date.interface';
import * as moment from 'moment';

/**
 * Person, each project can extend this person class
 * NPM package dependencies:
 *  a) moment
 */
export class Person {

  // Parts of a person's name
  public firstName: string;
  public middleName: string;
  public lastName: string;

  /** Format to display birthdate */
  public dobFormat = 'YYYY/MM/DD';

  // Initialize dob to nulls
  public dateOfBirth: SimpleDate = { year: null, month: null, day: null };

  /** Returns DoB in YYYYMMDD format, used by API. */
  get dateOfBirthShort(): string {
    return this.isDobEmpty() ? null :
        moment( {
          year: this.dateOfBirth.year,
          month: this.dateOfBirth.month - 1,
          day: this.dateOfBirth.day
        }).format( 'YYYYMMDD' );
  }

  /** Returns DoB in dobFormat (default: YYYY/MM/DD), for display purposes */
  get formatDateOfBirth(): string {
    return this.isDobEmpty() ? null :
        moment( {
          year: this.dateOfBirth.year,
          month: this.dateOfBirth.month - 1,
          day: this.dateOfBirth.day
        }).format( this.dobFormat );
  }

  /** Indicates whether or not the date of birth is empty */
  isDobEmpty(): boolean {
    return Object.keys( this.dateOfBirth )
        .map( key => this.dateOfBirth[key] )
        .filter( x => x ) // Filter out null/undefined
        .length !== 3;
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

  /** Calculates the age from date of birth */
  getAge(): Number {
    const dobDt = new Date( this.dateOfBirth.year, this.dateOfBirth.month, this.dateOfBirth.day );
    return Math.ceil( moment( ).diff( dobDt, 'year', true ) );
  }
}
