import { forwardRef, Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Optional, Self} from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
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
  styleUrls: ['./checkbox.component.scss'],

  // TODO: Remove to make custom form control -- possible breaking change
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ]
})
export class CheckboxComponent extends Base implements  OnInit, ControlValueAccessor {
  defaultErrorMessage: string = '';

  /**
   * You can bind to [(data)] OR you can use [(ngModel)] but don't use both.
   */
  @Input() data: boolean = false;
  @Input() required: boolean = false;  // TODO: Remove - breaking change
  @Input() disabled: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() errorMessageRequired: string;
  @Input() showError: boolean;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkbox') checkbox: ElementRef;


  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    if ( this.errorMessageRequired ) {
      this.defaultErrorMessage = this.errorMessageRequired;
    } else {
      this.defaultErrorMessage = this.label + ' is required.';
    }
  }

  setCheckboxVal(event: boolean) {
    console.log(event);
    this.data = event;
    this.dataChange.emit(this.data);
    this._onChange(event);
    this._onTouched();
  }

  focus() {
    this.checkbox.nativeElement.focus();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.data = value;
  }
}
