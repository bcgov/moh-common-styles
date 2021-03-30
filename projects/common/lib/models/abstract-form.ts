import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractBaseForm } from './abstract-base-form';

export abstract class AbstractForm extends AbstractBaseForm {
  /** Access to the form elements for validation */
  @ViewChild('formRef', { static: true }) form: NgForm;

  /**
   * Constructor
   */
  constructor(protected router: Router) {
    super(router);
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
