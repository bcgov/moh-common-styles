import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MaskModel, LETTER, NUMBER, SPACE } from '../../../models/src/mask.model';

@Component({
  selector: 'common-postal-code',
  templateUrl: './postal-code.component.html',
  styleUrls: ['./postal-code.component.scss'],

  // Re-use the same ngForm that it's parent is using. The component will show
  // up in its parents `this.form`, and will auto-update `this.form.valid`
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm }]
})
export class PostalCodeComponent extends MaskModel implements OnInit {

  @Input() label: string = 'Postal Code';
  @Input() displayMask: boolean = true;

  constructor() {
    super();
    this.mask = [LETTER, NUMBER, LETTER, SPACE, NUMBER, LETTER, NUMBER];
    this.placeholder = 'V1V V1V';
   }

  ngOnInit() {
  }
}
