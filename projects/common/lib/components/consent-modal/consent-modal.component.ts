import { forwardRef, Component, EventEmitter, Input, Output, ViewChild, Inject, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';
import {ApplicationBase} from '../../../models/src/application-base.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { CommonLogger, CommonLogMessage } from '../../../services/src/logger.service';
import {AbstractHttpService} from '../../../services/src/abstract-api-service';
import { ControlContainer, ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';


/**
 * Consent Modal is a Modal with the Information or Notice. It can be used to get the User's consent an
 * then proceed with the application. It also makes an API call to the SPA-ENV server to see if the app is under
 * maintenance.
 *
 *
 * @example
*       	<common-consent-modal #mspConsentModal body='Body Of Consent'
*               title='Notice' [application]="mspAccountApp"
*               processName='MSP'
*               agreeLabel='I have read and understand this info'
*               (onClose)="addressChangeChkBx.focus()">
*           </common-consent-modal>
 * @export
 */

export interface ISpaEnvResponse {
  SPA_ENV_MSP_MAINTENANCE_FLAG: string;
  SPA_ENV_MSP_MAINTENANCE_MESSAGE: string;
  SPA_ENV_ACL_MAINTENANCE_FLAG: string;
  SPA_ENV_ACL_MAINTENANCE_MESSAGE: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_START: string;
  SPA_ENV_NOW: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_END: string;
}



@Component({
  selector: 'common-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => ConsentModalComponent )}
  ]
})

export class ConsentModalComponent extends AbstractHttpService implements ControlValueAccessor, OnInit  {

    protected _headers: HttpHeaders = new HttpHeaders();
    @Input() processName: string;
    @Input() application: ApplicationBase;
    @Input() isUnderMaintenance: boolean = false;
    @Input() title: string;
    @Input() body: string;
    @Input() agreeLabel: string = 'Agree';
    @Input() continueButton: string = 'Continue';
    @Input() maintenanceFlag: string = 'false';
    @Input() url: string = '/msp/api/env';

    @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
    @Output() close = new EventEmitter<void>();
    @Output() cutOffDate: EventEmitter<ISpaEnvResponse> = new EventEmitter<ISpaEnvResponse>();

    public spaEnvRes: ISpaEnvResponse = {} as any;
    // public maintenanceFlag: string ;
    public maintenanceMessage: string;

    // tslint:disable-next-line:max-line-length
    private _applicationHeaderMap: Map<string, string> = new Map([['ACL', '{"SPA_ENV_MSP_ACL_MAINTENANCE_FLAG":"","SPA_ENV_MSP_ACL_MAINTENANCE_MESSAGE":""}'], ['MSP', '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}'], ['PA', '{"SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":"","SPA_ENV_NOW":""}']]);
    agreeCheck: boolean = false;

    public _onChange = (_: any) => {};
    public _onTouched = () => {};


    constructor(protected http: HttpClient,  private logService: CommonLogger) {
        super(http);
    }



    ngOnInit(): void {
      // Called after ngOnInit when the component's or directive's content has been initialized.
      // Add 'implements AfterContentInit' to the class.
      if (this.isUnderMaintenance) {
        this.inMaintenance();
      }

    }

    showFullSizeView() {
        this.fullSizeViewModal.config.backdrop = false;
        this.fullSizeViewModal.config.keyboard = false;
        this.fullSizeViewModal.show();
    }

    continue() {
        this.application.infoCollectionAgreement = true;
        this.fullSizeViewModal.hide();
        this.close.emit();
        this._onChange(true);
        this._onTouched();
    }

    // Api callout to get the message from the Rapid code
    sendSpaEnvServer(rapidResponseCode: string): Observable<any> {
        this._headers = new HttpHeaders({
            'SPA_ENV_NAME': rapidResponseCode
        });
        return this.post<any>(this.url, null);
    }

    protected handleError(error: HttpErrorResponse) {
      console.log('handleError', JSON.stringify(error));
      if (error.error instanceof ErrorEvent) {
          // Client-side / network error occured
          console.error('MspMaintenanceService error: ', error.error.message);
      } else {
          // The backend returned an unsuccessful response code
          console.error(`MspMaintenanceService Backend returned error code: ${error.status}.  Error body: ${error.error}`);
      }
      // this.logService.log({event: 'error', key: 'Cannot get maintenance flag from spa-env-server'});

      // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
      return of(error);
  }


  inMaintenance() {
        const headerName = this._applicationHeaderMap.get(this.processName);

        this.sendSpaEnvServer(headerName)
                .subscribe(response => {
                    this.spaEnvRes = <ISpaEnvResponse> response;
                    console.log(this.spaEnvRes);
                    if (this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_MESSAGE;
                    } else if (this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage =  this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
                    }
                    if (this.spaEnvRes.SPA_ENV_PACUTOFF_MAINTENANCE_START) {
                        this.cutOffDate.emit(this.spaEnvRes);
                    }

			}, (error: Response | any) => {
                console.log('Error when calling the MSP Maintenance: ' + error);
                this.logService.log({
                  event: 'ACL - SPA Env System Error',
                  success: false,
                  errMsg: 'ACL - SPA Env Rapid Response Error' + error
                });
        }

      );
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.application.infoCollectionAgreement = value;
  }
}
