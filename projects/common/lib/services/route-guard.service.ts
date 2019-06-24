import { Injectable, InjectionToken, Injector } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractPgCheckService } from './abstract-pg-check.service';

/**
 * Use this service to implement Route Guards in your application. This is for a
 * typical form flow, where the user must proceed sequentially from one page to
 * the next.
 *
 * To setup, you must:
 *
 * 1. Create a service that `extends CheckCompleteBaseService` ("RegistrationService")
 * 2. Setup AbstractPgCheckService in NgModule providers, to `useExisting` the service from previous step..
 * 3. Add this RouteGuardService to same providers from previous step.
 * 4. Configure routes to use RouteGuardService - `canActivate` or `canActivateChild`
 * 5. Have each "page" in the form call `setPageIncomplete()` or `setPageComplete()` (from the "RegistrationService")
 *
 *
 * You must make sure to setup AbstractPgCheckService in NgModules correctly.
 *
 *  @example
 *                //STEP 2 + STEP 3
 *                //registration.module.ts
 *                providers: [
 *                        ...
 *                        { provide: AbstractPgCheckService, useExisting: RegistrationService },
 *                        RouteGuardService
 *                ]
 *
 *
 *                //STEP 4
 *                //registration-routing.modle.ts
 *                const routes: Routes = [{
 *                   path: '',
 *                   canActivateChild: [RouteGuardService] //or canActivate
 *                  }
 *                   ...
 *                ]
 *
 *
 *                //STEP 5
 *                //example.component.ts
 *                ngOnInit() { this.setPageIncomplete(); }
 *                continue() { this.setPageComplete(); }
 *
 *
 */
@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router,
    private service: AbstractPgCheckService) {
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
     * Pre-requisite has not be completed
     */
    if (false === this.service.isPrerequisiteComplete()) {
      this.router.navigate([this.service.getStartUrl()]);
      return false;
    }

    if (false === this.service.isPageComplete(pageUrl)) {
      return false;
    }

    return true;
  }
}

