import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractPageGuardService } from './abstract-page-guard.service';


/**
 * Use this service to implement Load Page Route Guards in your application. This is for a
 * typical form flow, where the user must proceed sequentially from one page to
 * the next.
 *
 * To setup, you must:
 *
 * 1. Create a service implementing the abstract methods in `AbstractPageGuardService`
 * 2. Setup AbstractPageGuardService in NgModule providers, to `useExisting` the service from previous step.
 * 3. Add this LoadPageGuardService to same providers from previous step.
 * 4. Configure routes to use LoadPageGuardService - `canActivate` or `canActivateChild`
 * 5. Have each "page" in the form call `setPageIncomplete()` or `setPageComplete()` (from the "PageStateService")
 *
 *
 * You must make sure to setup AbstractPageGuardService in NgModules correctly.
 *
 *  @example
 *                //STEP 2 + STEP 3
 *                //registration.module.ts
 *                providers: [
 *                        ...
 *                        { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
 *                        LoadPageGuardService
 *                ]
 *
 *
 *                //STEP 4
 *                //registration-routing.modle.ts
 *                const routes: Routes = [{
 *                   path: '',
 *                   canActivateChild: [LoadPageGuardService] //or canActivate
 *                  }
 *                   ...
 *                ]
 *
 *
 *                //STEP 5
 *                //example.component.ts
 *                ngOnInit() { this.pageService.setPageIncomplete(); }
 *                continue() { this.pageService.setPageComplete(); }
 *
 *
 */
@Injectable({
  providedIn: 'root'
})
export class LoadPageGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private service: AbstractPageGuardService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this._continue(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._continue(state.url);
  }

  /** Logic to determine whether or not allow to continue to next page */
  private _continue(pageUrl: string): boolean {

    if (this.service.canBypassGuards()) {
      return true;
    }

    /**
     * Logic within method is specific to application
     */
    return this.service.canNavigateToUrl(pageUrl);
  }
}
