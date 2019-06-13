import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'common-form-action-bar',
  templateUrl: './form-action-bar.component.html',
  styleUrls: ['./form-action-bar.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class FormActionBarComponent implements OnInit {
  @Input() submitLabel: string = 'Continue';
  @Input() canContinue: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() defaultColor: boolean = true;
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * `extra-width-mobile-only` will add an extra 15px to left/right sides.  This
   * is ONLY for mobile. This is useful when the parent is a `.container-fluid`
   * but you have overridden the padding for medium and up sizes but had to keep
   * mobile padding so text isn't flat with edge (as per latest designs).
   *
   * Example CSS:
   *
   *     .container-fluid { @include media-breakpoint-up(md){ padding-left: 0; padding-right: 0; } }
   */
  @Input() widthOption: 'default' | 'extra-width-mobile-only' | 'extra-width' = 'default';

  constructor() { }

  ngOnInit() {
  }

  onClick($event) {
    if (!this.isLoading && this.canContinue) {
      this.btnClick.emit($event);
    }
    $event.stopPropagation();
    return false;
  }
}
