import { forwardRef, Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Base } from '../../models/base';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CheckboxComponent )}
  ]
})

export class CheckboxComponent extends Base implements  ControlValueAccessor {

  @Input() data: boolean = true;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() errorMessageRequired: string = this.label + 'Field is required.';
  @Input() checked: boolean =  false ;
  @Input() showError: boolean;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkbox') checkbox: ElementRef;


  public _onChange = (_: any) => {};
  public _onTouched = () => {};


  constructor() { super(); }


  /*setCheckboxVal(event: boolean) {
    console.log(event);
    this.data = event;
    this.dataChange.emit(this.data);
    this._onChange(event);
    this._onTouched();
  }*/

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
