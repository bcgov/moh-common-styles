import { TestBed, inject } from '@angular/core/testing';
import { PageStateService, PageList } from './page-state.service';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, Router } from '@angular/router';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

@Component({
  template: `<h1>Hello World</h1>`,
})
class RouteOneComponent {

  constructor() {}
}

@Component({
  template: `<h1>Good-bye World</h1>`,
})
class RouteTwoComponent {

  constructor() {}
}

@Component({
  template: `<h1>What planet are we on?</h1>`,
})
class RouteThreeComponent {

  constructor() {}
}

const ROUTES_LIST_DEFAULT = {
  ROUTE_1: {
    path: 'route-1',
    fullpath: '/route-1',
    title: 'Route 1'
  },
  ROUTE_2: {
    path: 'route-2',
    fullpath: '/route-2',
    title: 'Route 2'
  },
  ROUTE_3: {
    path: 'route-3',
    fullpath: '/route-3',
    title: 'Route 3'
  }
};

const pages: Routes = [
  {
    path: ROUTES_LIST_DEFAULT.ROUTE_1.path,
    component: RouteOneComponent
  },
 {
    path: ROUTES_LIST_DEFAULT.ROUTE_2.path,
    component: RouteTwoComponent
  },
  {
    path: ROUTES_LIST_DEFAULT.ROUTE_3.path,
    component: RouteThreeComponent
  }
];

function addKeys( x: any ): {[key: string]: any} {
  return {
    fullpath: x.fullpath,
    title: x.title
  };
}

describe('PageStateService', () => {

  let service: PageStateService;
  let router: Router;
  let pageList: PageList[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(pages),
        HttpClientTestingModule
      ],
      declarations: [
        RouteOneComponent,
        RouteTwoComponent,
        RouteThreeComponent
      ],
      providers: [PageStateService]
    });

    service = TestBed.get(PageStateService);
    router = TestBed.get(Router);
    pageList = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate common page list structure (required fields only)', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
      },
      ROUTE_2: {
        path: 'route-2',
      },
      ROUTE_3: {
        path: 'route-3',
      }
    };
    pageList = service.setPages( pages, ROUTES_LIST );
    expect(pageList.length).toEqual( 3 );
    expect( Object.keys( pageList[0]).length ).toEqual( 3 );
  });

  it('should populate common page list structure (additional fields)', () => {
    pageList = service.setPages( pages, ROUTES_LIST_DEFAULT, addKeys );
    expect(pageList.length).toEqual( 3 );
    expect( Object.keys( pageList[0]).length ).toEqual( 5 );
  });

  it('able to navigate to all URLs', () => {
    service.setPages( pages, ROUTES_LIST_DEFAULT, addKeys );

    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath );
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath ) ).toBeTruthy();

    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath );
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath ) ).toBeTruthy();

    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath );
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath ) ).toBeTruthy();
  });

  it('able to navigate to past, and present pages, but not future page', () => {

    service.setPages( pages, ROUTES_LIST_DEFAULT, addKeys );

    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath );
    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath );
    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath );

    service.setPageIncomplete( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath );  // present page
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath ) ).toBeTruthy();
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath ) ).toBeTruthy();
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath ) ).toBeFalsy();
  });

  it('able to navigate to first page only', () => {
    service.setPages( pages, ROUTES_LIST_DEFAULT, addKeys );

    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath );
    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath );
    service.setPageComplete( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath );

    service.clearCompletePages();
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_1.fullpath ) ).toBeTruthy();
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath ) ).toBeFalsy();
    expect( service.canNavigateToPage( ROUTES_LIST_DEFAULT.ROUTE_3.fullpath ) ).toBeFalsy();
  });

  it('should find index for URL in page list', () => {
    service.setPages( pages, ROUTES_LIST_DEFAULT, addKeys );

    const idx = service.findIndex( ROUTES_LIST_DEFAULT.ROUTE_2.fullpath );
    expect( idx ).toBe( 2 );
    const obj = service.getPageAtIndex( idx );
    expect( obj.path ).toMatch( ROUTES_LIST_DEFAULT.ROUTE_2.path );
  });

  // TODO: Figure out how to test routes when parameter not passed into method
});
