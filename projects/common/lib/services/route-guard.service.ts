import { Injectable, InjectionToken, Injector } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractPgCheckService } from './abstract-pg-check.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanActivateChild  {

  constructor( private router: Router,
               private service: AbstractPgCheckService ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {

    return this._continue( state.url );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._continue( state.url );
  }

  /** Logic to determine whether or not allow to continue to next page */
  private _continue( pageUrl: string ): boolean {

    if ( this.service.canBypassGuards() ) {
      return true;
    }

    /**
     * Pre-requisite has not be completed
     */
    if ( false === this.service.isPrerequisiteComplete() ) {
      this.router.navigate( [this.service.getStartUrl()] );
      return false;
    }

    if ( false === this.service.isPageComplete( pageUrl ) ) {
      return false;
    }

    return true;
  }
}

