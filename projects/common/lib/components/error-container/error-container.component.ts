import { Component, Input } from '@angular/core';

@Component({
  selector: 'common-error-container',
  templateUrl: './error-container.component.html',
  styleUrls: ['./error-container.component.scss']
})
export class ErrorContainerComponent {

  @Input() displayError: boolean = false;

  constructor() { }
}
