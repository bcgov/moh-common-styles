import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'common-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements OnInit {

  @Input() data: boolean;
  @Input() required: boolean = true;
  @Input() showError: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessageRequired: string = 'Field is required.';
  @Input() label: string = 'Default Checkbox';
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('buttonGroup') buttonGroup: ElementRef;

  constructor() { 

  }

  ngOnInit() {
  }

  focus() {
    this.buttonGroup.nativeElement.focus();
  }

}
