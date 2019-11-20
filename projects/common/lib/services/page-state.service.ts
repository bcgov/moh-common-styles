import { Injectable } from '@angular/core';
import { Route } from '@angular/router';

export interface CommonPageList {
  index: number;
  path: string;
  isComplete: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommonPageStateService {

  private _pageList: CommonPageList[] = [];

  constructor() { }

  // Setter for applications who save data using a storage service
  pageList( list: CommonPageList[] ) {
    this._pageList = list;
  }

  setPages( arr: Route[],
            routeListConst: any,
            fn?: (x: any) => {[key: string]: any} ): CommonPageList[] {

    if ( this._pageList && !this._pageList.length ) {

      const routeConst = Object.keys( routeListConst ).map( x => routeListConst[x] );

      let cnt = 0;
      this._pageList = arr.filter((itm: any) => !itm.redirectTo)
        .map((itm: any) => {
          const val = routeConst.find( x => x.path === itm.path );

          cnt = cnt + 1; // count for indices

          // Page List to be returned
          let obj = {
            index: cnt,
            path: val.path,
            isComplete: false,
          };

          if ( fn ) {
            obj = Object.assign( obj, fn( val ) );
          }
          return obj;
        });
    }
    return this._pageList;
  }

  // Returns index parameter value
  findIndex( url: string ): number {
    let idx = 0;
    if ( this._pageList ) {
      const obj = this._pageList.find( x => url.includes(x.path) );
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  getPageAtIndex( idx: number ): CommonPageList  | null {
    const index = idx - 1;
    if ( this._pageList && index >= 0 && this._pageList.length > index ) {
      return this._pageList[index];
    }
    return null;
  }

  setPageIncomplete( path: string ) {
    const obj = this._pageList.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = false;
      // Set future pages to not complete
      this._pageList.map( x => {
        if ( obj.index < x.index && x.isComplete ) {
          x.isComplete = false;
        }
      });
    }
  }

  setPageComplete( path: string ) {
    const obj = this._pageList.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = true;
    }
  }

  isPageComplete( path: string ): boolean {
    let complete = false;
    const obj = this._pageList.find( x => path.includes(x.path) );
    if ( obj ) {
      // Requirement to continue is the previous page must also be complete
      const prevIdx = obj.index - 1;
      complete = (prevIdx === 0 ? obj.isComplete :
        this._pageList[prevIdx - 1].isComplete ) && obj.isComplete;
    }
    return complete;
  }

  clearCompletePages() {
    this._pageList.map( x => {
        x.isComplete = false;
    });
  }
}
