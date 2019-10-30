import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[commonDateFieldFormat]'
})
export class DateFieldFormatDirective {

  @Output() ngModelChange: EventEmitter<string> = new EventEmitter<string>(false);

  @HostListener('input', ['$event'])
  onInput( event: KeyboardEvent ) {
    const input = event.target as HTMLInputElement;
    const maxlen = input.getAttribute( 'maxlength' );

    let trimmed = input.value.trim();
    if (/[^\d]+/.test( input.value ) ) {

      trimmed = trimmed.replace(/[^\d]/g, '');
    }

    trimmed = trimmed.substr( 0, Number( maxlen ) );

    input.value = trimmed;
    this.ngModelChange.emit( trimmed );
  }
}
