import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replacewithlinks'
})
export class ReplacewithlinksPipe implements PipeTransform {

   
    private links =   [
        {
          code: 'HIBC',
          name: ' <a href=\'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us\' target=\'_blank\'> Health Insurance BC</a>'
        },
        {
          code: 'ACBC',
          name: ' <a href=\'https://www.addresschange.gov.bc.ca\' target=\'_blank\'> Change of Address Service</a>'
        }
    
      ]

    transform(value: any, args?: any): any {
        let str: String = value;
        if (value) {
            this.links.forEach(linkData => {
                var re = new RegExp(linkData.code,"gi");
                str = str.replace(re, linkData.name);
            })
        }
        return str;
    }

}
