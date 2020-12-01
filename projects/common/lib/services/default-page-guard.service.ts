import { Injectable, InjectionToken, Injector } from '@angular/core';
import { PageStateService } from './page-state.service';
import { AbstractPageGuardService } from './abstract-page-guard.service';

export const START_PAGE_URL = new InjectionToken<string>( 'StartPageUrl' );
export const BYPASS_GUARDS = new InjectionToken<boolean>( 'ByPassGuards' );

/**
 * Default page guard service, ByPassGuards & StartPageUrl are injected only if not extending service
 *
 *  @example
 *
 *                providers: [
 *                         ...
 *                        { provide: ByPassGuards, useValue: environment.bypassGuards },
 *                        { provide: StartPageUrl, useValue: CREATE_FACILITY_PAGES.HOME.fullpath },
 *                        DefaultPageGuardService
 *                        { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
 *                        LoadPageGuardService
 *                ]
 *

 */
@Injectable({
  providedIn: 'root'
})
export class DefaultPageGuardService implements AbstractPageGuardService {

  bypassGuards: boolean = false;
  startPageUrl: string = '';

  constructor( private pageStateService: PageStateService, private injector: Injector ) {}

  public canBypassGuards(): boolean {

    const bypass = this.injector.get( BYPASS_GUARDS );

    return bypass ? bypass : this.bypassGuards;
  }

  public canNavigateToUrl( url: string ): boolean {

    const startUrl = this.injector.get( START_PAGE_URL );
    const _startUrl = startUrl ? startUrl : this.startPageUrl;
    const containStartUrl: boolean = url.includes( _startUrl );

    // Empty list allow navigation to first page
    if ( this.pageStateService.pageListIsClear() ) {

      // Trying to navigate to start page
      if ( containStartUrl ) {
        return true;
      }

      // Redirect to start page
      this.pageStateService.navigateByUrl( _startUrl );
      return false;
    }

    return this.pageStateService.canNavigateToPage( url );
  }
}
