import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { scrollToError } from '../../../helpers/scroll-helpers';

@Component({
  selector: 'common-form-action-bar',
  templateUrl: './form-action-bar.component.html',
  styleUrls: ['./form-action-bar.component.scss'],
  // TODO: Figure out why this is required.
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class FormActionBarComponent implements OnInit {
  @Input() submitLabel: string = 'Continue';
  @Input() canContinue: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() defaultColor: boolean = true;
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();

  @Input() scrollToErrorsOnSubmit: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  onClick($event) {
    if (!this.isLoading && this.canContinue) {
      this.btnClick.emit($event);

      if (this.scrollToErrorsOnSubmit) {
        // Scroll to error after 50ms, give time for errors to display etc.
        // This timeout is outside of Angular change detection.
        setTimeout(scrollToError, 50);
      }
    }
    $event.stopPropagation();
    return false;
  }
}
