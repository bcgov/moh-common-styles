import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractBaseForm } from './abstract-base-form';


export abstract class AbstractReactForm extends AbstractBaseForm {

  /** Access to the form elements for validation */
  form: FormGroup;

  /** What happens when the user clicks the continue button. Generally navigating to another page. */
  abstract continue(): void;

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
    return this.form.valid;
  }

  /** Runs the angular 'markAsTouched()' on all form inputs. */
  protected markAllInputsTouched(forms: FormGroup | FormGroup[] = null): void {

    // Passed in parameter, set each as touched
    if ( forms ) {
      if ( Array.isArray( forms ) ) {
        // For each form mark as touched to display errors
        return forms.forEach( x => {
          x.markAsTouched();
        });
      }
      // Returns true if form is valid
      forms.markAsTouched();
    } else {
      this.form.markAsTouched();
    }
  }
}
