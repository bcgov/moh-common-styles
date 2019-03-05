import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


/**
 * FormSubmitBar is similar to FormActionBar, but it is meant to be used with
 * (ngSubmit) on the form. Make sure to enclose FormSubmitBar inside of the form
 * in question.
 */
@Component({
  selector: 'common-form-submit-bar',
  templateUrl: './form-submit-bar.component.html',
  styleUrls: ['./form-submit-bar.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) } ]
})
export class FormSubmitBarComponent implements OnInit {
  @Input() submitLabel: string = 'Continue';
  @Input() canContinue: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() defaultColor: boolean = true;
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
}
