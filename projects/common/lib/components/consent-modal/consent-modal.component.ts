import { forwardRef, Component, EventEmitter, Input, Output, ViewChild, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { CommonLogger } from '../../services/logger.service';
import { AbstractHttpService } from '../../services/abstract-api-service';
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
  SPA_ENV_SUPPBEN_MAINTENANCE_FLAG: string;
  SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE: string;
  SPA_ENV_SUPPBEN_MAINTENANCE_START: string;
  SPA_ENV_SUPPBEN_MAINTENANCE_END: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_FLAG: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_START: string;
  SPA_ENV_NOW: string;
  SPA_ENV_PACUTOFF_MAINTENANCE_END: string;
}

// Disabling tslint for @example below.
// tslint:disable:max-line-length

/**
 * ConsentModalComponent, aka the "Information Collection Notice", is a modal
 * designed to be shown at the beginning of an application. It is a boilerplate
 * checkbox to consent to information collection.
 *
 * Currently this component requires the body to be manually set as a child
 * element (via transclusion)
 *
 * TODO - Set default body if none is passed in.
 *
 * @example
 *       <common-consent-modal #consentModal [isUnderMaintenance]="false"
 *                          title="Information collection notice"
 *                          agreeLabel="I have read and understand this information"
 *                          processName="processName"
 *                          (accept)="accountLetterApplication.infoCollectionAgreement = $event;  saveApplication($event)">
 *                      <p><strong>Keep your personal information secure – especially when using a shared device like a computer at a library, school or café.</strong> To delete any information that was entered, either complete the application and submit it or, if you don’t finish, close the web browser.</p><p><strong>Need to take a break and come back later?</strong> The data you enter on this form is saved locally to the computer or device you are using until you close the web browser or submit your application.</p><p><strong>Information in this application is collected by the Ministry of Health</strong> under section 26(a), (c) and (e) of the Freedom of Information and Protection of Privacy Act and will be used to determine eligibility for provincial health care benefits in BC and administer Premium Assistance. Should you have any questions about the collection of this personal information please <a href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us" target="_blank">contact Health Insurance BC <i class="fa fa-external-link" aria-hidden="true"></i></a>.</p>
 *       </common-consent-modal>
 *
 *
 *        // Component code - Remove backticks when copying (necessary to render docs)
 *        `@ViewChild('consentModal') consentModal: ConsentModalComponent`
 *        ...
 *        openModal(){
 *          this.consentModal.showFullSizeView();
 *        }
 */
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

    /**
     * If `isUnderMaintenance` is true, then this will automatically try and
     * make a request to the SPA ENV server to determine if it's in a
     * maintenance window.  If your application determines this manually, leave
     * this alone.
     */
    @Input() isUnderMaintenance: boolean = false;
    @Input() title: string;
    @Input() body: string; // = '<p><strong>Keep your personal information secure – especially when using a shared device like a computer at a library, school or café.</strong> To delete any information that was entered, either complete the application and submit it or, if you don’t finish, close the web browser.</p><p><strong>Need to take a break and come back later?</strong> The data you enter on this form is saved locally to the computer or device you are using until you close the web browser or submit your application.</p><p><strong>Information in this application is collected by the Ministry of Health</strong> under section 26(a), (c) and (e) of the Freedom of Information and Protection of Privacy Act and will be used to determine eligibility for provincial health care benefits in BC and administer Premium Assistance. Should you have any questions about the collection of this personal information please <a href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us" target="_blank">contact Health Insurance BC <i class="fa fa-external-link" aria-hidden="true"></i></a>.</p>';
    @Input() agreeLabel: string = 'I have read and understand this info';
    @Input() continueButton: string = 'Continue';
    @Input() maintenanceFlag: string = 'false';
    @Input() url: string = '/msp/api/env';
    @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
    @Output() close = new EventEmitter<void>();
    @Output() cutOffDate: EventEmitter<ISpaEnvResponse> = new EventEmitter<ISpaEnvResponse>();
    @Output() accept = new EventEmitter<boolean>();

    /**
     * Used in cases where we have custom form controls inside NgContent that we
     * wish to be satisifed before user can continue through modal.
     */
    @Input() disableContinue: boolean = false;

    public spaEnvRes: ISpaEnvResponse = {} as any;
    public maintenanceMessage: string;

    // public maintenanceFlag: string ;

    // TODO: This should eventually be pulled out of the common library as it pertains to MSP-specific code.
    // tslint:disable-next-line:max-line-length
    private _applicationHeaderMap: Map<string, string> = new Map([
      ['ACL', '{"SPA_ENV_ACL_MAINTENANCE_FLAG":"","SPA_ENV_ACL_MAINTENANCE_MESSAGE":""}'],
      ['MSP', '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}'],
      ['PA', '{"SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":"","SPA_ENV_NOW":"","SPA_ENV_PACUTOFF_MAINTENANCE_FLAG":"","SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE":""}'],
      ['SUPPBEN', '{"SPA_ENV_SUPPBEN_MAINTENANCE_START":"","SPA_ENV_SUPPBEN_MAINTENANCE_END":"","SPA_ENV_NOW":"","SPA_ENV_SUPPBEN_MAINTENANCE_FLAG":"","SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE":"","SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":""}'],
    ]);
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

    /**
     * Call this method to display the modal.
     */
    showFullSizeView() {
        this.fullSizeViewModal.config.keyboard = false;
        this.fullSizeViewModal.show();
    }

    continue() {
        this.accept.emit(true);
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
      // console.log('handleError', JSON.stringify(error));
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
                    // console.log(this.spaEnvRes);
                    // TODO: This should eventually be pulled out of the common library as it pertains to MSP-specific code.
                    if (this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_MESSAGE;
                    } else if (this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage =  this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
                    } else if (this.spaEnvRes.SPA_ENV_PACUTOFF_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE;
                    } else if (this.spaEnvRes.SPA_ENV_SUPPBEN_MAINTENANCE_FLAG === 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE;
                    }
                    if (this.spaEnvRes.SPA_ENV_PACUTOFF_MAINTENANCE_START) {
                        this.cutOffDate.emit(this.spaEnvRes);
                    }

            }, (error: Response | any) => {
                // console.log('Error when calling the MSP Maintenance: ' + error);
                this.logService.log({
                  event: 'ACL - SPA Env System Error',
                  success: false,
                  errMsg: 'ACL - SPA Env Rapid Response Error' + error
                });
        }

      );
  }

  registerOnChange(fn: any): void {
    this.accept.emit(fn) ;
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {

    //
  }

  isContinueDisabled(): boolean {
    return !this.agreeCheck || this.disableContinue;
  }
}
