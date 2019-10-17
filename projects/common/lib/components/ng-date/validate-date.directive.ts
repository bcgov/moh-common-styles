import { Directive } from '@angular/core';
import { Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[commonValidateDate]'
})
export class ValidateDateDirective implements Validator  {

  validate( control: FormControl ): {[key: string]: any} | null {

    console.log( 'ValidateDateDirective: ', control );
    return null;
  }

}
