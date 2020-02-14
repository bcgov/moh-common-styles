import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GeocoderService, GeoAddressResult } from './geocoder.service';

const mockResponseAddress = {
  fullAddress: 'Unit 101 -- 123 Streetname Rd., city, BC, CAN',
  localityName: 'city',
  country: 'CAN',
  provinceCode: 'BC',
}
const mockPayloadResponse = {
  features: [
    {
      properties: {
        ...mockResponseAddress
      }
    }
  ]
};
const expectedResult: GeoAddressResult[] = [
  {
    fullAddress: 'Unit 101 - 123 Streetname Rd., city, BC, CAN',
    city: 'city',
    street: 'Unit 101 - 123 Streetname Rd.',
    country: 'CAN',
    province: 'BC',
  }
];

describe('GeocoderService', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ GeocoderService ]
    });
  });

  it('should be created', () => {
    const service: GeocoderService = TestBed.get(GeocoderService);
    expect(service).toBeTruthy();
  });

  it('should replace \'--\' with \'-\' in the address.', (done) => {
    let httpClientSpy: { get: jasmine.Spy };
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    let service = new GeocoderService(<any> httpClientSpy);
    
    httpClientSpy.get.and.returnValue(of(mockPayloadResponse));

    service.lookup('Query Text').subscribe((addresses) => {
      expect(addresses).toEqual(expectedResult);
      done();
    });
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should replace \'--\' with \'-\' in the address in processResponse.', () => {
    class GeocoderServiceTest extends GeocoderService {
      public processResponseTest() {
        return this.processResponse(mockPayloadResponse)
      }
    }
    let serviceTest = new GeocoderServiceTest(<any> {});
    expect(serviceTest.processResponseTest()).toEqual(expectedResult)
  });
});
