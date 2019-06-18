import { Injectable, InjectionToken, Injector } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractPgCheckService } from './abstract-pg-check.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivateChild  {

  constructor( private router: Router,
               private service: AbstractPgCheckService ) {
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log( 'BypassGuards: ', this.service.canBypassGuards() );

    if ( this.service.canBypassGuards() ) {
      console.log( 'Bypassing route guards' );
      return true;
    }

   console.log( 'canActivateChild: ', next, state, this.router.url );

    /**
     * If start page not visited, send user there to start process
     */
    if ( !this.service.isPrerequisiteComplete() || this.service.isStartPageVisited() ) {
      this.router.navigate( [this.service.getStartUrl()] );
      return false;
    }

    if ( !this.service.isPageComplete( state.url ) ) {
      console.log( 'Page is not complete' );
      return false;
    }

    return true;
  }
}

