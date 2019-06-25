import { Router } from '@angular/router';
import { AbstractPgCheckService } from './abstract-pg-check.service';
import { Injectable } from '@angular/core';

/**
 * Interface for used when checking completeness of item
 */
export interface PageListInterface {
  route: string;
  isComplete: boolean;
  [key: string]: any;
}

/**
 * Extend this class when creating a service to create your custom Route Guard
 * logic.  This class should work as-is for simple use-cases.  For Route Guard
 * setup @see RouteGuardService.
 *
 * @see RouteGuardService
 */
@Injectable({
  providedIn: 'root'
})
export class CheckCompleteBaseService implements AbstractPgCheckService {

  public pageCheckList: PageListInterface [] = [];

  private _startUrl: string = '';
  private _bypassGuards: boolean = false;

  constructor( protected router: Router ) {}

  set startUrl( url: string ) {
    this._startUrl = url;
  }

  set bypassGuards( bypass: boolean) {
    this._bypassGuards = bypass;
  }

  public canBypassGuards(): boolean {
    return this._bypassGuards;
  }

  public getStartUrl(): string {
    return this._startUrl;
  }

  /** Any prerequisites that need list of pages */
  public isPrerequisiteComplete(): boolean {
    return !this.isPageListEmpty();
  }

  /**
   *  Sets page to not be completed, so applicants cannot complete application out of sequence
   */
  public setPageIncomplete(): void {
    const idx = this.getUrlIndex( this.router.url );
    if ( !this.isPageListEmpty() ) { // Check guards could be turned off in dev environment
      this.pageCheckList = this.pageCheckList.map((item, index) => {
        if (index >= idx) {
          item.isComplete = false;
        }
        return item;
      });
    }
  }

  /**
   * Sets the page to completed, allowing applicant to proceed to next page.
   */
  public setPageComplete(): void {
    const idx = this.getUrlIndex( this.router.url );
    if ( !this.isPageListEmpty() ) { // Check guards could be turned in dev environment
      this.pageCheckList[idx].isComplete = true;
    }
  }

  /**
   * Indicates whether page has been completed or not.
   */
  public isPageComplete( url: string ): boolean {

    const idx = this.getUrlIndex( url );

    // returns previous items isComplete value
    return (idx - 1 >= 0) ? this.pageCheckList[idx - 1].isComplete : true;
  }

  /**
   * Check for incomplete pages
   */
  public isComplete(): boolean {
    const incompletePages = this.pageCheckList.filter( x => x.isComplete !== true );
    return (incompletePages.length !== 0 ? false : true );
  }

  /**
   * Index of URL in the items list, -1 if not exist
   */
  protected getUrlIndex( url: string ): number {
    return this.pageCheckList.findIndex( x => url.includes( x.route ) );
  }

  protected isPageListEmpty() {
    return ( this.pageCheckList.length === 0 );
  }
}
