import { WizardProgressItem } from '../components/wizard-progress-bar/wizard-progress-bar.component';
import { Route } from '@angular/router';

/** Base functionality for container that is used to display bread crumbs */
export class Container {

  /** Route items for the stepper */
  progressSteps: WizardProgressItem[];

  /**
   * Converts a lower case string of a route in a user readable title.  e.g.
   * "personal-info" -> "Personal Info"
   *
   * @param {string} routePath
   */
  convertRouteToTitle(routePath: string): string {
    return routePath.split('-').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
  }

  protected setProgressSteps( pageRoutes: Route[] ): void {
        // Interface for wizard progress items
        this.progressSteps = pageRoutes.map(page => {
          if (page.path !== '') {
            return {
              title: this.convertRouteToTitle(page.path),
              route: page.path
            };
          }
        }).filter(x => x);
  }
}
