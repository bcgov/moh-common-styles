import * as moment_ from 'moment';
import { Base } from './base';
import { SimpleDate } from './simple-date.interface';
import { Address } from './address.model';

const moment = moment_;

export enum Gender {
  Female = <any>'F',
  Male = <any>'M'
}


/**
 * Various statuses in Canada
 */
export enum StatusInCanada {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident,
}


/**
 * Reasons for returning to Canada
 */
export enum Activities {
 LivingInBCWithoutMSP,
 MovingFromProvince,
 MovingFromCountry,
 WorkingInBC,
 StudyingInBC,
 ReligiousWorker,
 Diplomat,
 Visiting
}

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
  public dobFormat = 'YYYY/MM/DD';

  /**
   * Gender
   */
  gender: Gender;

  _status: StatusInCanada;
  _currentActivity: Activities;
  healthNumberFromOtherProvince: string;
  public relationship: number;
  public sin: string;
  public phoneNumber: string;
  public movedFromProvinceOrCountry: string;
  public mailingAddress: Address = new Address();

  public residentialAddress: Address = new Address();

    /**
   * Now ask explicitly of the user
   * If answser is NO, the livedInBCSinceBirth = false
   * See https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-398
   */
  private _livedInBCSinceBirth: boolean = null;



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

  get status() {
    return this._status;
  }

  set status(st: StatusInCanada) {
      this._status = st;
      if (this._status === StatusInCanada.PermanentResident
          || this._status === StatusInCanada.TemporaryResident) {
          this._livedInBCSinceBirth = false;
      }
  }

  get currentActivity() {
      return this._currentActivity;
  }

  /**
   * All activies in the system now indicates that person has not lived in BC since birth.
   */
  set currentActivity(act: Activities) {
      this._currentActivity = act;
  }


  /* Copy function */
  copy( object: Person ) {
    this.firstName = object.firstName;
    this.middleName = object.middleName;
    this.lastName = object.lastName;
    this.dateOfBirth.month = object.dateOfBirth.month;
    this.dateOfBirth.day = object.dateOfBirth.day;
    this.dateOfBirth.year = object.dateOfBirth.year;
  }
}
