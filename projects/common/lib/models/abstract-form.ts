import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, Params } from '@angular/router';

/**
 * TODO: Make interface for abstract form - this form is the template form implementation
 * Need to create a reactive form implementation
 */
export abstract class AbstractForm {
  /** Access to the form elements for validation */
  @ViewChild('formRef') form: NgForm;

  /** Disables all inputs (todo: not implemented) */
  disabled: boolean;
  /** Show or hide the loading spinner as required, should be passed to form action bar. */
  loading: boolean = false;
  /** What happens when the user clicks the continue button. Generally navigating to another page. */
  abstract continue(): void;


  /**
   * Constructor
   */
  constructor(protected router: Router) {
    this.router = router;
  }

  /**
   * Determines if the Continue button is disabled on the form action bar
   */
  canContinue(): boolean {
    // Returns true if form is valid
    return this.form.valid;
  }

  /** Runs the angular 'markAsTouched()' on all form inputs. */
  protected markAllInputsTouched(): void {
    Object.keys(this.form.form.controls).forEach(x => {
      this.form.form.get(x).markAsTouched();
    });
  }

}
