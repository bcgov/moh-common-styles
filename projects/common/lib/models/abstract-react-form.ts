import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractBaseForm } from './abstract-base-form';


export abstract class AbstractReactForm extends AbstractBaseForm {

  /** Access to the form elements for validation */
  formGroup: FormGroup;

  /**
   * Constructor
   */
  constructor(protected router: Router) {
    super(router);
  }

  /**
   * Determines if the Continue button is disabled on the form action bar
   * Can be overrided
   */
  canContinue(): boolean {

    // Returns true if form is valid
    return this.formGroup.valid;
  }

  /** Runs the angular 'markAsTouched()' on all form inputs. */
  protected markAllInputsTouched(fg: FormGroup | FormGroup[] = null): void {

    // Passed in parameter, set each as touched
    if ( fg ) {
      if ( Array.isArray( fg ) ) {
        // For each form mark as touched to display errors
        return fg.forEach( x => {
          this._markAllAsTouched( x );
        });
      }
      // Returns true if form is valid
      this._markAllAsTouched( fg );
    } else {
      this._markAllAsTouched( this.formGroup );
    }
  }

  // Temporary until libray forms updated to version.
  private _markAllAsTouched(fg: FormGroup) {
    const controls: Array<string> = Object.keys(fg.controls);

    for (const control of controls) {
      fg.controls[control].markAsTouched();
    }
  }
}
