import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() serviceName: string = '';
  @Input() urlBaseName: string = '';

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
