import { UUID } from 'angular2-uuid';

/**
 * Base class.  Components extend this class to have object IDs.
 */
export class Base {

  /** An identifier for parents to keep track of components */
  public objectId: string = UUID.UUID();

  constructor() {}
}
