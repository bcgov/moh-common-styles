import { Component, OnInit } from '@angular/core';

/**
 *
 * The base styles for a breadcrumb with slots for content to go.  If you need a
 * complex breadcrumb, the idea is you can extend this CoreBreadcrumb and use
 * the base styles.  There are 3 slots: left, center, and right - all are
 * optional and any configuration works. You select the slot by adding it as an
 * attribute to the top level elements inside of the breadcrumb element.
 *
 *   Example usage:
 *
 *   <common-core-breadcrumb>
 *    <div left>
 *      <a routerLink="/provisioner/">Dashboard</a> /
 *      <strong>Provision by {{ IS_SHOWING_PERSON ? "User" : "Site" }}</strong>
 *    </div>
 *    <div center></div>
 *    <div right></div>
 *   </common-core-breadcrumb>
 *
 *   @export
 *   @class CoreBreadcrumbComponent
 *   @implements {OnInit}
 */
@Component({
  selector: 'common-core-breadcrumb',
  templateUrl: './core-breadcrumb.component.html',
  styleUrls: ['./core-breadcrumb.component.scss']
})
export class CoreBreadcrumbComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
