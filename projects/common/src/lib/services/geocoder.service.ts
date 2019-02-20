import { Injectable } from '@angular/core';
import { AbstractHttpService } from './abstract-api-service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface GeoAddressResult {
    /** String from the API that includes street, city, province, and country. */
    fullAddress: string;
    city: string;
    street: string;
    // Set to defaults in response
    country: string;
    province: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeocoderService extends AbstractHttpService {

    protected _headers: HttpHeaders = new HttpHeaders();
    private BASE_URL = 'https://geocoder.api.gov.bc.ca';
    private ADDRESS_URL = `${this.BASE_URL}/addresses.json?`;


    /** Defaults for service */
    public defaultCountry: string = 'Canada';
    public defaultProv: string = 'British Columbia';

    constructor(protected http: HttpClient) {
        super(http);
    }


    // https://geocoder.api.gov.bc.ca/addresses.json?minScore=50&maxResults=5&echo=false&brief=true&autoComplete=true&addressString=784+Hock
    lookup(address: string): Observable<GeoAddressResult[]> {
        const params = new HttpParams()
            .set('minScore', '50')
            .set('maxResults', '10')
            .set('echo', 'false')
            .set('brief', 'false') // API splits address string up into sub-attributes, like city  / street name
            .set('autoComplete', 'true')
            .set('matchPrecisionNot', 'LOCALITY,STREET,BLOCK,INTERSECTION')
            .set('addressString', address);

        return this.get(this.ADDRESS_URL, params).pipe(map(this.processResponse));
    }

    /**
     * Formats the response from ADDRESS_URL, trimming irrelevant fields.
     *
     * This works for other requests for the same API too, however it may error
     * out on some items if matchPrecisionNot is not set.
     *
     * @param obj The response from ADDRESS_URL
     */
    private processResponse(obj): GeoAddressResult[] {
        return obj.features.map(feature => {
            const props = feature.properties;
            const city = props.localityName;
            // We get street just by trimming everything before city, more
            // stable than looking for commas, etc.
            const cityIndex = props.fullAddress.indexOf(`, ${city}`);
            const street = props.fullAddress.slice(0, cityIndex);
            return {
                fullAddress: props.fullAddress,
                city,
                street,
                country: this.defaultCountry, // Default to Canada
                province: this.defaultProv    // Default to BC
            };
        });
    }

    protected handleError(error: HttpErrorResponse) {
        console.error('GeoCoder network error', { error });
        return throwError('Geocoder error');
    }
}
