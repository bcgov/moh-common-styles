import { Router, Params } from '@angular/router';
import { scrollTo } from '../../helpers/scroll-helpers';

export abstract class AbstractBaseForm {

  /** Disables all inputs (todo: not implemented) */
  disabled: boolean;
  /** Show or hide the loading spinner as required, should be passed to form action bar. */
  loading: boolean = false;
  /** What happens when the user clicks the continue button. Generally navigating to another page. */
  abstract continue(): void;
  /** Determines if the Continue button is disabled on the form action bar */
  abstract canContinue(): boolean;

  /**
   * Constructor
   */
  constructor(protected router: Router) {
    this.router = router;
  }

  /** Navigates to a route then automatically scrolls to the top of the page. */
  protected navigate(url: string, queryParams?: Params ) {

    this.router.navigate([url], { queryParams: queryParams })
      .then(() => {
        scrollTo();
      });
  }
}
