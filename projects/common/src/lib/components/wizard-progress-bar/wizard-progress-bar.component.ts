import { Component, OnInit, Input, ViewChild, ElementRef,
         ViewChildren, QueryList, ChangeDetectionStrategy,
         ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Base } from '../models/base';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * NPM Dependencies:
 *  a) rxjs
 *  b) ngx-bootstrap
 */

export interface WizardProgressItem {
  title: string;
  route: string;
}

@Component({
  selector: 'common-wizard-progress-bar',
  templateUrl: './wizard-progress-bar.component.html',
  styleUrls: ['./wizard-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardProgressBarComponent extends Base implements OnInit, OnDestroy {
  @Input() progressSteps: WizardProgressItem[] = [];
  @ViewChild('stepContainer') stepContainer: ElementRef;
  @ViewChildren('steps') steps: QueryList<ElementRef<HTMLAnchorElement>>;

  public activeIndex: number;

  private routerEvents$: Subscription;

  constructor(private router: Router, private cd: ChangeDetectorRef) {
    super();
   }

  ngOnInit() {

    // Update the progress bar view on route change and _only_ route chaange.
    // Skip most of Angular's ChangeDetection in favour of manually optimizing.
    this.routerEvents$ = this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd),
      map((ev: NavigationEnd) => ev.url)
    ).subscribe(url => {
      this.activeIndex = this.getActiveIndex(url);
      this.cd.detectChanges();
      this.scrollStepIntoView();
    });

    // Must schedule first run manually, or bar won't be set.
    this.activeIndex = this.getActiveIndex(this.router.url);
  }

  ngOnDestroy(){
    this.cd.detach();
    this.routerEvents$.unsubscribe();
  }

  calculateProgressPercentage(): Number {
    const denominator = this.progressSteps.length;
    const numerator = this.activeIndex + 1;

    if (denominator === 0 || numerator >= denominator){
      return 100;
    }

    // Because we've switched from space-evenly to space-around (for IE), we
    // have to handle the half-space that space-around adds to the start/end of
    // the container
    const halfSpace = 1 / (denominator * 2);
    return Math.round(((numerator / denominator) - halfSpace) * 100);
  }

  getActiveIndex(url): number {
    return this.progressSteps.findIndex(x => url.includes(x.route));
  }

   /**
   * Primarily for mobile, this horizontally scrolls the step into view.
   *
   * Note - be very careful with any changes to this function because it steps
   * outside of Angular to call native browser functions.
   */
  private scrollStepIntoView() {
    const target = this.steps.toArray()[this.activeIndex];
    const container = document.getElementsByClassName('horizontal-scroll');
    if (container.length === 1) {
      // Since we're already breaking out of Angular, we try and be safe by using a try/catch.
      // Otherwise an error here could halt execution,
      try {
        container[0].scrollLeft = target.nativeElement.offsetLeft - (window.outerWidth / 2);
      } catch (error) {}
    }
  }

}
