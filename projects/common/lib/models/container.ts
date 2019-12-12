import { Route } from '@angular/router';
import { ContainerService, DefaultSubmitLabel } from '../services/container.service';
import { Subscription } from 'rxjs';

export interface WizardProgressItem {
  title: string;
  route: string;
}

/**
 * Container class contains the basic functionality for containers.
 *
 * @example
 *  Example of how to use Container
 *
 *      export class RegistrationContainerComponent extends Container
 *                   implements AfterViewInit, OnDestroy {
 *
 *        constructor( private headerService: HeaderService,
 *                     private pageStateService: PageStateService,
 *                     protected  containerService: ContainerService) {
 *          super( containerService );
 *          this.setProgressSteps(pages);
 *          this.pageStateService.setPages( pages, PRACTITIONER_REGISTRATION_PAGES );
 *          this.headerService.setTitle('Practitioner Assignment to Medical Services Plan Facility for Business Cost Premium');
 *        }
 *
 *        ngAfterViewInit() {
 *          this.subscribeFormBar();
 *        }
 *
 *        ngOnDestroy() {
 *          this.unsubscribeFormBar();
 *        }
 *        ...
 *      }
 *
 * html would be:
 *
 *    <common-core-breadcrumb>
 *      <common-wizard-progress-bar center [progressSteps]="progressSteps"></common-wizard-progress-bar>
 *    </common-core-breadcrumb>
 *    <common-page-framework layout="blank">
 *      <router-outlet></router-outlet>
 *    </common-page-framework>
 *    <common-form-action-bar (btnClick)="continue()"            <= function within Container
 *                            [submitLabel]="submitLabel"        <= variable within Container
 *                            [isLoading]="isLoading"            <= variable within Container
 *                            [defaultColor]="useDefaultColor"   <= variable within Container
 *                            widthOption='extra-width-mobile-only'></common-form-action-bar>
 *
 * @export
 *
 */

/** Base functionality for container that is used to display bread crumbs */
export class Container {

  /** Route items for the stepper */
  progressSteps: WizardProgressItem[];

  /** Observables for form bar */
  useDefaultColor: boolean = true;
  submitLabel: string = DefaultSubmitLabel;
  isLoading: boolean = false;

  private _subscriptions: Subscription[];

  constructor( protected containerService?: ContainerService ) {
  }

  /**
   * Use when form bar is part of the container
   */
  continue() {
    this.containerService.submitButtonClicked();
  }

  /**
   * Converts a lower case string of a route in a user readable title.  e.g.
   * "personal-info" -> "Personal Info"
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

  /**
   * Subscribe to form bar observables - Called in the AfterViewInit
   * Use when form bar is part of the container
   */
  protected subscribeFormBar() {
    if ( this.containerService ) {

      this._subscriptions = [
        this.containerService.$useDefaultColor
        .subscribe(
          (async (defaultColor) => {
            this.useDefaultColor = await defaultColor;
            console.log( 'defaultColor: ', this.useDefaultColor );
        })),
        this.containerService.$submitLabel
        .subscribe(
          (async (label) => {
            this.submitLabel = await label;
            console.log( 'button label: ', this.submitLabel );
        })),
        this.containerService.$isLoading
        .subscribe(
          (async (isLoading) => {
            this.isLoading = await isLoading;
            console.log( 'isLoading: ', this.isLoading );
        }))
      ];
    }
  }

  /**
   * Unsubscribe to form bar observables  - Called in the onDestroy()
   * Use when form bar is part of the container
   */
  protected unsubscribeFormBar() {
    this._subscriptions.forEach( x => x.unsubscribe() );
  }
}
