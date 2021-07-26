import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

// payload returned from the server
@Injectable()
export class ServerPayload {
    nonce: string;
    token: string;
}

@Injectable()
export class RecaptchaDataService {
  constructor(private httpClient: HttpClient) { }

  public verifyRecaptcha(apiBaseUrl: string,
                          nonce: string,
                          token: string): Observable<HttpResponse<ServerPayload>> {
      return this.httpClient
          .post<ServerPayload>(
              apiBaseUrl + '/verify/captcha',
              { nonce: nonce, token: token },
              { observe: 'response' });
  }
}
