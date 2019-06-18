import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * Interface for used when checking completeness of item
 */
export interface ItemCheckInterface {
  route: string;
  isComplete: boolean;
}

export class CheckCompleteBaseService {

  public itemCheckList: ItemCheckInterface [] = [];

  constructor( protected router: Router ) { }


  /** Any prerequisites that need to be complete prior to starting to check pages */
  public prerequisitesComplete(): boolean {
    return true;
  }

  /**
   * Checks if item list is present
   */
  public isEmpty(): boolean {
    console.log( 'CheckCompleteBaseService - isEmpty' );
    return (this.itemCheckList.length === 0);
  }

  /**
   *  Sets page to not be completed, so applicants cannot complete application out of sequence
   */
  public setItemIncomplete(): void {
    const idx = this.getUrlIndex( this.router.url );
    if ( !this.isEmpty() ) { // Check guards could be turned off in dev environment
      this.itemCheckList = this.itemCheckList.map((item, index) => {
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
  public setItemComplete(): void {
    const idx = this.getUrlIndex( this.router.url );
    if ( !this.isEmpty() ) { // Check guards could be turned in dev environment
      this.itemCheckList[idx].isComplete = true;
    }
  }

  /**
   * Indicates whether page has been completed or not.
   */
  public isPageComplete( url: string ): boolean {
    const idx = this.getUrlIndex( url );

    // returns previous items isComplete value
    return (idx - 1 >= 0) ? this.itemCheckList[idx - 1].isComplete : true;
  }

  /**
   * Check for incomplete pages
   */
  public isComplete(): boolean {

    const incompletePages = this.itemCheckList.filter( x => x.isComplete !== true );
    return (incompletePages.length !== 0 ? false : true );
  }

  /**
   * Index of URL in the items list, -1 if not exist
   */
  private getUrlIndex( url: string ): number {
    return this.itemCheckList.findIndex( x => url.includes( x.route ) );
  }
}
