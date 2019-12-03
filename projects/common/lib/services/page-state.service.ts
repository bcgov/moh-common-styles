import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

export interface PageList {
  index: number;
  path: string;
  isComplete: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PageStateService {

  pageList: PageList[] = [];

  constructor( protected router: Router ) { }

  setPages( arr: Route[],
            routeListConst: any,
            fn?: (x: any) => {[key: string]: any} ): PageList[] {

    if ( this.pageList && !this.pageList.length ) {

      const routeConst = Object.keys( routeListConst ).map( x => routeListConst[x] );

      let cnt = 0;
      this.pageList = arr.filter((itm: any) => !itm.redirectTo)
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
    return this.pageList;
  }

  // Returns index parameter value
  findIndex( url: string = null ): number {
    let idx = 0;
    if ( this.pageList ) {
      const obj = this._find(url ? url : this.router.url);
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  getPageAtIndex( idx: number ): PageList  | null {
    const index = idx - 1;
    if ( this.pageList && index >= 0 && this.pageList.length > index ) {
      return this.pageList[index];
    }
    return null;
  }

  setPageIncomplete( url: string = null ) {
    const obj = this._find(url ? url : this.router.url);
    if ( obj ) {
      obj.isComplete = false;
      // Set future pages to not complete
      this.pageList.map( x => {
        if ( obj.index < x.index && x.isComplete ) {
          x.isComplete = false;
        }
      });
    }
  }

  setPageComplete( path: string = null ) {
    const obj =  this._find(path ? path : this.router.url);
    console.log( 'setPageComplete: ', this.router.url, obj );
    if ( obj ) {
      obj.isComplete = true;
    }
  }

  canNavigateToPage( path: string  = null): boolean {
    let complete = false;
    const obj =  this._find(path ? path : this.router.url);
    if ( obj ) {
      // Can navigate to first play whether complete or not
      const prevIdx = obj.index - 1;
      complete = (prevIdx === 0 ? true : this.pageList[prevIdx - 1].isComplete );
    }
    return complete;
  }

  clearCompletePages() {
    this.pageList.map( x => {
        x.isComplete = false;
    });
  }

  // Find item in list
  private _find( path: string ) {
    return this.pageList.find( x => path.includes(x.path) || path.endsWith(x.path));
  }
}
