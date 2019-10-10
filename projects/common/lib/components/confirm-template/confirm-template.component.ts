import { Component, Input } from '@angular/core';
import { Base } from '../../models/base';


export enum ApiStatusCodes {
  SUCCESS = '0',
  ERROR = '1',
  WARNING = '2'
}

@Component({
  selector: 'common-confirm-template',
  templateUrl: './confirm-template.component.html',
  styleUrls: ['./confirm-template.component.scss']
})
export class ConfirmTemplateComponent extends Base {

  @Input() displayIcon: ApiStatusCodes = ApiStatusCodes.SUCCESS;

  constructor() {
    super();
  }

  // Status codes
  get successCode() {
    return ApiStatusCodes.SUCCESS;
  }

  get errorCode() {
    return ApiStatusCodes.ERROR;
  }

  get warningCode() {
    return ApiStatusCodes.WARNING;
  }
}
