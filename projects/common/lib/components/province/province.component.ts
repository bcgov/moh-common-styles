import { Component, Input, Output, EventEmitter, Optional, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CANADA } from '../country/country.component';
import { AbstractFormControl } from '../../models/abstract-form-control';
import { ErrorMessage, LabelReplacementTag } from '../../models/error-message.interface';

export const BRITISH_COLUMBIA = 'BC';
export interface ProvinceList {
  provinceCode: string;
  description: string;
  country: string;
}

export const PROVINCE_LIST: ProvinceList[] = [
  { provinceCode: 'AB', description: 'Alberta', country: CANADA },
  { provinceCode: 'BC', description: 'British Columbia', country: CANADA },
  { provinceCode: 'MB', description: 'Manitoba', country: CANADA },
  { provinceCode: 'NB', description: 'New Brunswick', country: CANADA },
  { provinceCode: 'NL', description: 'Newfoundland and Labrador', country: CANADA },
  { provinceCode: 'NS', description: 'Nova Scotia', country: CANADA },
  { provinceCode: 'ON', description: 'Ontario', country: CANADA },
  { provinceCode: 'PE', description: 'Prince Edward Island', country: CANADA },
  { provinceCode: 'QC', description: 'Quebec', country: CANADA },
  { provinceCode: 'SK', description: 'Saskatchewan', country: CANADA },
  { provinceCode: 'NT', description: 'Northwest Territories', country: CANADA },
  { provinceCode: 'NU', description: 'Nunavut', country: CANADA },
  { provinceCode: 'YT', description: 'Yukon', country: CANADA }
];

export function getProvinceDescription( provinceCode: string ) {
  const provObj = PROVINCE_LIST.find( val => provinceCode === val.provinceCode && CANADA === val.country );
  return provObj ? provObj.description : provinceCode;
}

@Component({
  selector: 'common-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent extends AbstractFormControl implements OnInit {

  @Input() label: string = 'Province';
  @Input() provinceList: ProvinceList[] = PROVINCE_LIST;
  @Input() labelforId: string = 'province_' + this.objectId;
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Please select a province';
  @Input() maxlength: string = '250';
  @Input() useDropDownList: boolean = true;
  @Input() bcOnly: boolean = false;
  @Input()
  set value( val: string ) {
    if ( val ) {
      this.province = val;
    }
  }
  get value() {
    return this.province;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  province: string;

  _defaultErrMsg: ErrorMessage = {
    required: LabelReplacementTag + ' is required.',
    invalidChar: LabelReplacementTag + ' must contain letters and may include special characters such as hyphens, ' +
                 'periods, apostrophes and blank characters.'
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

  provinceChange( event: any ) {
    const province = this.provinceList[Number(event.target.value)];
    console.log('province:', province);
    if (province) {
      console.log('provinceCode:', province.provinceCode);
      this._onChange(province.provinceCode);
      this.valueChange.emit(province.provinceCode);
      this.province = province.provinceCode;
    }
  }

  typedProvinceChange(event: any) {
    const province = event.target.value;
    if ( province ) {
      this._onChange(province);
      this.valueChange.emit(province);
      this.province = province;
    }
  }

  writeValue( value: any ): void {
    if ( value !== undefined ) {
      this.province = value;
    }
  }
}
