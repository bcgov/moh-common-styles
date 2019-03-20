import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

// payload returned from the server
@Injectable()
export class ServerPayload {
    nonce: string;
    captcha: string;
    validation: string;
    expiry: string;
}

@Injectable()
export class CaptchaDataService {

    constructor(private httpClient: HttpClient) { }
    // private http: Http) { }

    public fetchData(apiBaseUrl: string, nonce: string): Observable<HttpResponse<ServerPayload>> {
        return this.httpClient
            .post<ServerPayload>(
                apiBaseUrl + '/captcha',
                { nonce: nonce },
                { observe: 'response' });
    }

    public verifyCaptcha(apiBaseUrl: string,
                            nonce: string,
                            answer: string,
                            encryptedAnswer: string): Observable<HttpResponse<ServerPayload>> {
        return this.httpClient
            .post<ServerPayload>(
                apiBaseUrl + '/verify/captcha',
                { nonce: nonce, answer: answer, validation: encryptedAnswer },
                { observe: 'response' });
    }

    public fetchAudio(apiBaseUrl: string, validation: string, translation?: string) {
        const payload: any = { validation: validation };
        if (translation) {
            payload.translation = translation;
        }
        return this.httpClient
            .post<string>(
                apiBaseUrl + '/captcha/audio',
                payload,
                { observe: 'response' });
    }
    /*
      fetchData(apiBaseUrl: string, nonce: string): Observable<Response> {
        return this.http.post(apiBaseUrl + '/captcha', {nonce: nonce}, {});
      }

      verifyCaptcha(apiBaseUrl: string, nonce: string, answer: string, encryptedAnswer: string): Observable<Response> {
        return this.http.post(apiBaseUrl + '/verify/captcha', {nonce: nonce, answer: answer, validation: encryptedAnswer}, {});
      }

      fetchAudio(apiBaseUrl: string, validation: string): Observable<Response> {
        return this.http.post(apiBaseUrl + '/captcha/audio', {validation: validation}, {});
      }
    */
}
