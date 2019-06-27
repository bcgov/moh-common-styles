import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

/**
 * The "Page Framework" is a template to be used on FPCare pages to ensure
 * consistent layout.  It should be used on every page unless there is a good
 * exception.
 *
 * Note: CommonFormActionBar (and SubmitBar) must come *AFTER* this element, not
 * inside in version 2.0.0 and above.
 *
 * @example
 * <common-page-framework>
 *        <div>This will go in the middle column</div>
 *        <p>So will this</p>
 *        <div aside> This will go in the side column, or tips.</div>
 * </common-page-framework>
 * <common-form-action-bar></common-form-action-bar>
 *
 * @export
 */
@Component({
  selector: 'common-page-framework',
  templateUrl: './page-framework.component.html',
  styleUrls: ['./page-framework.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageFrameworkComponent implements OnInit {

  @Input() layout: 'single' | 'double' | 'blank' | 'default' = 'default';

  ngOnInit() {
  }

}
