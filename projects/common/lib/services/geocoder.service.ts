// Contains information licensed under the Open Government Licence  British Columbia.
import { Injectable } from '@angular/core';
import { AbstractHttpService } from './abstract-api-service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CANADA } from '../components/country/country.component';

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
    protected BASE_URL = 'https://geocoder.api.gov.bc.ca';
    protected  ADDRESS_URL = `${this.BASE_URL}/addresses.json?`;

    constructor(protected http: HttpClient) {
        super(http);
    }

    // https://github.com/bcgov/api-specs/blob/master/geocoder/geocoder-developer-guide.md
    lookup(address: string): Observable<GeoAddressResult[]> {
        const params = new HttpParams()
            .set('minScore', '50')
            .set('maxResults', '10')
            .set('echo', 'true')
            .set('interpolation', 'adaptive')
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
    protected processResponse(obj): GeoAddressResult[] {
        return obj.features.map(feature => {
            const props = feature.properties;
            const city = props.localityName;
            // We get street just by trimming everything before city, more
            // stable than looking for commas, etc.
            const cityIndex = props.fullAddress.indexOf(`, ${city}`);
            const street = props.fullAddress.slice(0, cityIndex);
            const province = props.provinceCode;
            const country = CANADA; // ALWAYS return Canada

            return {
              fullAddress: props.fullAddress,
              city,
              street,
              province,
              country
            };
        });
    }

    protected handleError(error: HttpErrorResponse) {
        console.error('GeoCoder network error', { error });
        return throwError('Geocoder error');
    }
}
