import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * HeaderComponent is the stylized blue header at the top of every single
 * application.  It has a built-in "Skip to Content" tab-accessible section
 * that's best practice for screen readers.  **You must create an element with
 * `id='content'` for this to work!**  Best practice is to put this "content"
 * element as a wrapper aroud your `<router-outlet>`
 *
 */
@Component({
  selector: 'common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() serviceName: string = '';
  @Input() urlBaseName: string = '';
  @Input() logoSrc: string = 'assets/gov3_bc_logo.png';
  @Input() shouldShowPrintLogo: boolean = false;
  @Input() printLogoSrc: string = 'assets/logo_print.png';

  public skipLinkPath;
  private SKIP_CONTENT_HASH = '#content';

  constructor(private router: Router ) {
  }

  ngOnInit() {

    this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd),
    ).subscribe(this.updateSkipContentLink.bind(this));

    this.updateSkipContentLink();
  }

  routeIsActive(url: string): boolean {
    return this.router.url.includes(url);
  }

  updateSkipContentLink() {
    this.skipLinkPath = this.generateSkipToContentLink();
  }

  // Slightly complicated because we have to include the deployUrl in manually.
  // If deployUrl changes this code must too.
  //
  // "http://full-url.com/fpcare/example#content"
  private generateSkipToContentLink(): string {
    // don't add duplicate #contents
    if (window.location.href.indexOf(this.SKIP_CONTENT_HASH) !== -1) {
      return window.location.href;
    }

    return `${window.location.origin}/${this.urlBaseName + this.router.url}#content`;
  }
}
