import { Injectable } from '@angular/core';

/**
 * The abstract class for our route guard service.  You MUST setup the NgModule
 * to provide your application's service in place of AbstractGuardService.
 *
 * Your application's load page guard service can do whatever it wants as long as it
 * implements these methods.
 *
 * More information on setup can be found in @see LoadPageGuardService.
 *
 *  @example
 *
 *                providers: [
 *                        ...
 *                        { provide: AbstractPageGuardService, useExisting: EnrolService },
 *                        LoadPageGuardService
 *                ]
 *
 */
@Injectable()
export abstract class AbstractPageGuardService {

  public abstract canBypassGuards(): boolean;
  public abstract canNavigateToUrl( url: string ): boolean;
}
