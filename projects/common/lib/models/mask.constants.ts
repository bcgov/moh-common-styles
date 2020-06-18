// List of constants used for masking inputs
export const LETTER = /[A-Z]/i; // Ignore case here, then upperCase it via pipe.
export const NUMBER = /\d/;
export const SPACE = ' ';

/*
export class MaskModel extends Base {

  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() disabled: boolean = false;
  @Input() required: boolean = true;

  public mask: any;
  public placeholder: string;

  constructor() {
    super();
  }

  /**
   * Upper cases letters in string
   */
  /*upperCasePipe(text: string) {
    return text.toUpperCase();
  }

  /**
   * Updates the value
   */
  /*onUpdate( value: string ) {

    // Emit value without spaces
    this.valueChange.emit( value );
  }
}*/
