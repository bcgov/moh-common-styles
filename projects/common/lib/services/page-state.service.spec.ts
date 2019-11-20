import { TestBed, tick } from '@angular/core/testing';
import { CommonPageStateService, CommonPageList } from './page-state.service';
import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: `<h1>Hello World</h1>`,
})
class RouteOneComponent {

  constructor() {}
}

@Component({
  template: `<h>Good-bye World</h1>`,
})
class RouteTwoComponent {

  constructor() {}
}

@Component({
  template: `<h>What planet are we on?</h1>`,
})
class RouteThreeComponent {

  constructor() {}
}

function addKeys( x: any ): {[key: string]: any} {
  return {
    fullpath: x.fullpath,
    title: x.title
  };
}

describe('PageStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
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

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];
    let pageList: CommonPageList[] = [];
    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    pageList = service.setPages( pages, ROUTES_LIST );
    expect(pageList.length).toEqual( 3 );
    expect( Object.keys( pageList[0]).length ).toEqual( 3 );
  });

  it('should populate common page list structure (additional fields)', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
        fullpath: '/test/route-1',
        title: 'Route 1'
      },
      ROUTE_2: {
        path: 'route-2',
        fullpath: '/test/route-2',
        title: 'Route 2'
      },
      ROUTE_3: {
        path: 'route-3',
        fullpath: '/test/route-3',
        title: 'Route 3'
      }
    };

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];
    let pageList: CommonPageList[] = [];
    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    pageList = service.setPages( pages, ROUTES_LIST, addKeys );
    expect(pageList.length).toEqual( 3 );
    expect( Object.keys( pageList[0]).length ).toEqual( 5 );
  });

  it('should set url complete', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
        fullpath: '/test/route-1',
        title: 'Route 1'
      },
      ROUTE_2: {
        path: 'route-2',
        fullpath: '/test/route-2',
        title: 'Route 2'
      },
      ROUTE_3: {
        path: 'route-3',
        fullpath: '/test/route-3',
        title: 'Route 3'
      }
    };

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];

    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    service.setPages( pages, ROUTES_LIST, addKeys );

    service.setPageComplete( ROUTES_LIST.ROUTE_1.fullpath );
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_1.fullpath ) ).toBeTruthy();

    service.setPageComplete( ROUTES_LIST.ROUTE_2.fullpath );
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_2.fullpath ) ).toBeTruthy();

    service.setPageComplete( ROUTES_LIST.ROUTE_3.fullpath );
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_3.fullpath ) ).toBeTruthy();
  });

  it('should set url incomplete including future pages', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
        fullpath: '/test/route-1',
        title: 'Route 1'
      },
      ROUTE_2: {
        path: 'route-2',
        fullpath: '/test/route-2',
        title: 'Route 2'
      },
      ROUTE_3: {
        path: 'route-3',
        fullpath: '/test/route-3',
        title: 'Route 3'
      }
    };

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];

    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    service.setPages( pages, ROUTES_LIST, addKeys );

    service.setPageComplete( ROUTES_LIST.ROUTE_1.fullpath );
    service.setPageComplete( ROUTES_LIST.ROUTE_2.fullpath );
    service.setPageComplete( ROUTES_LIST.ROUTE_3.fullpath );

    service.setPageIncomplete( ROUTES_LIST.ROUTE_2.fullpath );
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_1.fullpath ) ).toBeTruthy();
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_2.fullpath ) ).toBeFalsy();
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_3.fullpath ) ).toBeFalsy();
  });

  it('should set all pages in list to incomplete', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
        fullpath: '/test/route-1',
        title: 'Route 1'
      },
      ROUTE_2: {
        path: 'route-2',
        fullpath: '/test/route-2',
        title: 'Route 2'
      },
      ROUTE_3: {
        path: 'route-3',
        fullpath: '/test/route-3',
        title: 'Route 3'
      }
    };

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];

    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    service.setPages( pages, ROUTES_LIST, addKeys );

    service.setPageComplete( ROUTES_LIST.ROUTE_1.fullpath );
    service.setPageComplete( ROUTES_LIST.ROUTE_2.fullpath );
    service.setPageComplete( ROUTES_LIST.ROUTE_3.fullpath );

    service.clearCompletePages();
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_1.fullpath ) ).toBeFalsy();
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_2.fullpath ) ).toBeFalsy();
    expect( service.isPageComplete( ROUTES_LIST.ROUTE_3.fullpath ) ).toBeFalsy();
  });

  it('should find index for url in page list', () => {

    const ROUTES_LIST = {
      ROUTE_1: {
        path: 'route-1',
        fullpath: '/test/route-1',
        title: 'Route 1'
      },
      ROUTE_2: {
        path: 'route-2',
        fullpath: '/test/route-2',
        title: 'Route 2'
      },
      ROUTE_3: {
        path: 'route-3',
        fullpath: '/test/route-3',
        title: 'Route 3'
      }
    };

    const pages: Routes = [
      {
        path: ROUTES_LIST.ROUTE_1.path,
        component: RouteOneComponent
      },
     {
        path: ROUTES_LIST.ROUTE_2.path,
        component: RouteTwoComponent
      },
      {
        path: ROUTES_LIST.ROUTE_3.path,
        component: RouteThreeComponent
      }
    ];

    const service: CommonPageStateService = TestBed.get(CommonPageStateService);
    service.setPages( pages, ROUTES_LIST, addKeys );

    const idx = service.findIndex( ROUTES_LIST.ROUTE_2.fullpath );
    expect( idx ).toBe( 2 );
    const obj = service.getPageAtIndex( idx );
    expect( obj.path ).toMatch( ROUTES_LIST.ROUTE_2.path );
  });

});
