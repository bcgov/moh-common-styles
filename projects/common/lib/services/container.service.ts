import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

export const DefaultSubmitLabel: string = 'Continue';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  $isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );
  $submitLabelSubject: BehaviorSubject<string> = new BehaviorSubject( DefaultSubmitLabel );
  $useDefaultColorSubject: BehaviorSubject<boolean> = new BehaviorSubject( true );
  $continueBtnSubject: Subject<null> = new Subject();

  // Observables
  $isLoading = this.$isLoadingSubject.asObservable();
  $submitLabel = this.$submitLabelSubject.asObservable();
  $continueBtn = this.$continueBtnSubject.asObservable();
  $useDefaultColor = this.$useDefaultColorSubject.asObservable();

  constructor() { }

  /** If no parameter is passed, the default label is 'Continue' */
  setSubmitLabel( label: string  = DefaultSubmitLabel ) {
    this.$submitLabelSubject.next( label );
  }

  /** If no parameter is passed, it uses the default color */
  setUseDefaultColor( defaultColor: boolean = true ) {
    this.$useDefaultColorSubject.next( defaultColor );
  }

  /** If no parameter is passed, it sets the spinner active */
  setIsLoading( isLoading: boolean = true ) {
    this.$isLoadingSubject.next( isLoading );
  }

  submitButtonClicked() {
    this.$continueBtnSubject.next();
  }
}
