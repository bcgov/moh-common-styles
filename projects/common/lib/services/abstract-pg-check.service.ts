import { Injectable } from '@angular/core';

/**
 * @deprecated
 * The abstract class for our route guard service.  You MUST setup the NgModule
 * to provide your application's service in place of AbstractPgCheckService.
 *
 * Your application's route guard service can do whatever it wants as long as it
 * implements these methods.
 *
 * More information on setup can be found in @see RouteGuardService.
 *
 *  @example
 *                //registration.module.ts
 *                providers: [
 *                        ...
 *                        { provide: AbstractPgCheckService, useExisting: RegistrationService },
 *                        RouteGuardService
 *                ]
 *
 */
@Injectable()
export abstract class AbstractPgCheckService {

  public abstract canBypassGuards(): boolean;
  public abstract isPageComplete( url: string ): boolean;
  public abstract isPrerequisiteComplete(): boolean;
  public abstract getStartUrl(): string;
}
