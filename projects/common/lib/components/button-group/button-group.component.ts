import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ControlValueAccessor } from '@angular/core';

/**
 * ButtonGroupComponent is a Radio component. It is radio and shows YES/NO option as a button group
 * 
 *
 *
 * @example
 *       <common-button-group [showError]="showError"
 *          [errorMessageRequired]="'This field is Required. Please select any value.'"
 *          [label]="'Please select a value'" 
 *          [data]="data.value" (dataChange)="setMovedToBCPermanently($event)" >
 *         </common-button-group>
 *
 * @export
 */


@Component({
  selector: 'common-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements OnInit, ControlValueAccessor {

  @Input() data: boolean;
  @Input() required: boolean = true;
  @Input() showError: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessageRequired: string = 'Field is required.';
  @Input() label: string = 'Default Checkbox';
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('buttonGroup') buttonGroup: ElementRef;

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor() { 

  }

  ngOnInit() {
  }

  focus() {
    this.buttonGroup.nativeElement.focus();
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
