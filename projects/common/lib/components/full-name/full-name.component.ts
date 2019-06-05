import {forwardRef, Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {Person} from '../../../models/src/person.model';
import {Base} from '../../../models/src/base';
import {debounceTime} from 'rxjs/operators';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';


export interface FullNameErrorMsg {
  required?: string;
  pattern?: string;
}

/**
 * FullNameComponent includes a first, middle, and last name field.  If you only
 * need an individual field, @see NameComponent.
 *
 * **Note** This component is in dev, there are issues around "required"
 * TODO - Properly handle "required"
 *
 * @example
 *          <common-full-name [(person)]='person'></common-full-name>
 *
 * @export
 */
@Component({
  selector: 'common-full-name',
  templateUrl: './full-name.component.html',
  styleUrls: ['./full-name.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => FullNameComponent )}
  ]
})

export class FullNameComponent extends Base implements ControlValueAccessor, OnInit {

  @Input() person: Person;
  @Output() personChange = new EventEmitter<Person>();
  @Input() showError: boolean;
  @Input() firstNamelabel: string = 'First Name';
  @Input() middleNamelabel: string = 'Middle Name';
  @Input() lastNamelabel: string = 'Last Name';
  @Input() disabled: boolean = false;


  firstName: string ;
  middleName: string;
  lastName: string ;

  public NameRegEx: string = '^[a-zA-Z][a-zA-Z\\-.\' ]*$';

  public errMsg: FullNameErrorMsg ;
  // default messages
  private requiredMsgSeg: string = 'is required';
  private pattern: string = 'Must begin with a letter followed by a letters, hyphen, period, apostrophe, or blank character';

  public _onChange = (_: any) => {};
  public _onTouched = () => {};

  constructor() {
    super();
  }

  ngOnInit() {

    if (this.person) {
      this.firstName = this.person.firstName ? this.person.firstName : '';
      this.lastName = this.person.lastName ? this.person.lastName : '';
      this.middleName = this.person.middleName ? this.person.middleName : '';
    }

    this.errMsg =    {
      required: this.requiredMsgSeg,
      pattern: this.pattern
    };
  }

  /*ngAfterViewInit(): void {
      // https://github.com/angular/angular/issues/24818
      this.form.valueChanges.pipe(debounceTime(0)).subscribe((values) => {
        this.onChange.emit(values);
        this._onChange(values);
        this._onTouched();
      }
    );

  }*/

  // setFirstName(value: any) {
  //   this.person.firstName = value;
  //   this.onChange.emit(this.person);
  //   this._onChange(this.person);
  //   this._onTouched();
  // }

  // setMiddleName(value: any) {

  //   this.person.middleName = value;
  //   this.onChange.emit(this.person);
  //   this._onChange(this.person);
  //   this._onTouched();

  // }

  // setLastName(value: any) {

  //   this.person.lastName = value;
  //   this.onChange.emit(this.person);
  //   this._onChange(this.person);
  //   this._onTouched();

  // }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.person = value;
  }


}
