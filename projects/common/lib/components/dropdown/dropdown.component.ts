import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Base } from '../../models/base';

@Component({
  selector: 'common-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends Base implements ControlValueAccessor {
  public model: any;

  @Input() items = [];
  @Input() label: string = 'Default label';
  @Input() placeholder: string;
  @Input() autocorrect: string;
  @Input() addTag: boolean = false;
  @Input() addTagText: string = 'Add';
  @Input() required: boolean;
  @Input() clearable: boolean = true;

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor( @Optional() @Self() public controlDir: NgControl ) {
    super();
    if ( controlDir ) {
      controlDir.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.model = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

}
