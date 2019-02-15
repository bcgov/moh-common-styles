import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

/**
 *
 */
export abstract class AbstractForm {
    /** Access to the form elements for validation */
    @ViewChild( 'formRef' ) form: NgForm;

    /** Disables all inputs (todo: not implemented) */
    disabled: boolean;
    /** Show or hide the loading spinner as required, should be passed to form action bar. */
    loading: boolean = false;
    /** What happens when the user clicks the continue button. Generally navigating to another page. */
    abstract continue(): void;


  /**
   * Constructor
   * @param {Router} router
   */
  constructor( protected router: Router ) {
    this.router = router;
  }

  /**
   * Determines if the Continue button is disabled on the form action bar
   * @returns {boolean}
   */
  canContinue(): boolean {
    // Returns true if form is valid
    return this.form.valid;
  }

  /** Navigates to a route then automatically scrolls to the top of the page. */
  protected navigate( url: string ) {
    this.router.navigate( [url] )
    .then( (data) => { window.scrollTo( { top: 0, behavior: 'smooth' } );
   });
  }

}
