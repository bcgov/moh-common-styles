Moh-Common-Lib:
- [ ] Security warnings (GitHub)
  
Breaking Changes for version 3.0.0:

- [ ] FormActionBar / FormSubmiBar - make the on load default colour yellow
  - This can fix a "flash" of the first colour on macbooks and faster computers (nonVDI)
- [ ] Delete all instances of `showError`. We never use it as an @Input.
- [ ] *address.model.ts*
  - [ ] public hasValue: boolean; // TODO: Why do we need this? - Remove - breaking change
  - [ ] public isValid: boolean; // TODO: Why do we need this? - Remove - breaking change
- [ ] *radio.component.ts*
  - [ ] @Input() showError: boolean; // TODO: Remove - breaking change
  - [ ] // TODO: remove status change - breaking change
- [ ] *checkbox.component.ts*
  - [ ] Remove to make custom form control -- possible breaking change
  - [ ] @Input() required: boolean = false;  // TODO: Remove - breaking change
  - [ ] Remove the showError
- [ ] *xicon-button.component.ts*
  - [ ] Remove `clickEvent` output. Should be able to just use "click", which follows conventional Angular naming.
- [ ] *street.component.ts*
  - [ ] Replace "maxlen" with "maxlength" across this and other components. Maxlength is more semantic / consistent.  Search for this in other places too.
- [x] *date.component.ts* - Should become a FormControl (NgControl)
