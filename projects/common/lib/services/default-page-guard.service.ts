import { Injectable } from '@angular/core';
import { PageStateService } from './page-state.service';
import { AbstractPageGuardService } from './abstract-page-guard.service';

/**
 * Default page guard servicd
 *
 *  @example
 *
 *                providers: [
 *                        ...
 *                        { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
 *                        LoadPageGuardService
 *                ]
 *
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultPageGuardService implements AbstractPageGuardService {

  private _bypassGuards: boolean = false;

  constructor( private pageStateService: PageStateService ) {}

  set bypassGuards( bypass: boolean) {
    this._bypassGuards = bypass;
  }

  public canBypassGuards(): boolean {
    return this._bypassGuards;
  }

  public canNavigateToUrl( url: string ): boolean {
    return this.pageStateService.canNavigateToPage( url );
  }
}
