import { Injectable, InjectionToken, Injector } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckCompleteBaseService } from './check-complete-base.service';

export interface RouteGuardCfg {
  bypass: boolean; /** True to bypass guards - DEV  ONLY */
  startUrl: string; /** URL to start process */
}

/** Route Guard Configuration */
export const ROUTE_GUARD_CFG = new InjectionToken<RouteGuardCfg>( 'Route guard configuration' );

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivateChild  {

  protected cfg: RouteGuardCfg;

  constructor( private router: Router,
               private checkCompleteBaseService: CheckCompleteBaseService,
               private injector: Injector  ) {
    this.cfg = this.injector.get( ROUTE_GUARD_CFG );
    console.log( 'RouteGuardService cfg: ', this.cfg );
    console.log( 'checkCompleteBaseService: ', checkCompleteBaseService );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.cfg.bypass) {
      return true;
    }


   console.log( 'canActivateChild: ', next, state,
        this.checkCompleteBaseService.prerequisitesComplete(),
        this.checkCompleteBaseService.isEmpty(),
        this.router.url );

    /**
     * If start page not visited, send user there to start process
     */
    if ( !this.checkCompleteBaseService.prerequisitesComplete() || this.checkCompleteBaseService.isEmpty() ) {
      this.router.navigate( [this.cfg.startUrl] );
      return false;
    }

    if ( !this.checkCompleteBaseService.isPageComplete( state.url ) ) {
      console.log( 'Page is not complete' );
      return false;
    }

    return true;
  }
}

