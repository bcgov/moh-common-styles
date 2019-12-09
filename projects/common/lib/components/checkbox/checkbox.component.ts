import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Optional, Self} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';
/**
 * Checkbox component is a input checkbox
 *
 * @example
 *       <common-checkbox #addressChangeChkBx
 *          label='Do you want to opt in?'
 *          errorMessageRequired = 'Opt in should be selected'
 *          (dataChange)="dataChange($event)"
 *           [(data)]='person.hasOpted' [disabled]="isDisabled"
 *          [required]="isrequired">
 *       </common-checkbox>
 *
 * @export
 */


@Component({
  selector: 'common-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends AbstractFormControl implements OnInit, ControlValueAccessor {
  defaultErrorMessage: string = '';

  /**
   * You can bind to [(data)] OR you can use [(ngModel)] but don't use both.
   */
  @Input() data: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() required: boolean = false;  // TOBE removed duing MSP stablization - then update MSP to use form control version
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkbox') checkbox: ElementRef;

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
  };

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setCheckboxVal(event: boolean) {
    this.data = event;
    this.dataChange.emit(this.data);
    this._onChange(event);
    this._onTouched();
  }

  focus() {
    this.checkbox.nativeElement.focus();
  }

  writeValue(value: any): void {
    if ( value !== undefined || value === null ) {
      this.data = value;
    }
  }
}
