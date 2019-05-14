import {forwardRef, Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Person} from '../../../models/src/person.model';
import {Base} from '../../../models/src/base';
import {debounceTime} from "rxjs/operators";
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Name components is used to show Firstname, Middle Name and Last Name in the application.
 * 
 * @example
 *       	<common-name #name [person]="person" 
 *            (onChange)="onChange.emit($event)" [showError]="hasError" >
 *        </common-name>
 * @export
 */

export interface PasswordErrorMsg {
  required?: string;
  pattern?: string;
}

@Component({
  selector: 'common-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => NameComponent )}
  ]
})

export class NameComponent extends Base implements ControlValueAccessor{

  @Input() person: Person;
  @Input() showError: boolean;
  @Input() firstNamelabel: string = 'First Name';
  @Input() middleNamelabel: string = 'Middle Name';
  @Input() lastNamelabel: string = 'Last Name';

  @Output() onChange = new EventEmitter<any>();
  //Person: typeof Person = Person;
  firstName: string;
  middleName: string;
  lastName: string;

  public NameRegEx: string = '^[a-zA-Z][a-zA-Z\\-.\' ]*$';

  public errMsg: PasswordErrorMsg ;
  // default messages
  private requiredMsgSeg: string = 'is required';
  private pattern: string = 'Must begin with a letter followed by a letters, hyphen, period, apostrophe, or blank character';
  
  public _onChange = (_: any) => {};
  public _onTouched = () => {};
  
  constructor() {
    super();
  }
  
  ngOnInit() {
    
      if(this.person) {
      this.firstName = this.person.firstName ? this.person.firstName :'';
      this.lastName = this.person.lastName ? this.person.lastName :'';
      this.middleName = this.person.middleName ? this.person.middleName :'';
    }

    this.errMsg =    {
      required: this.requiredMsgSeg,
      pattern: this.pattern
    };
  }

  setFirstName(value: any) {
    this.person.firstName = value;
    this.onChange.emit(value);
    this._onChange(value);
    this._onTouched();
  }

  setMiddleName(value: any) {

    this.person.middleName = value;
    this.onChange.emit(value);
    this._onChange(value);
    this._onTouched();

  }

  setLastName(value: any) {

    this.person.lastName = value;
    this.onChange.emit(value);
    this._onChange(value);
    this._onTouched();

  }

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
