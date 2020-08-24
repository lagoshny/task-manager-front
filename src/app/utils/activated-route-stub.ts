import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  readonly snapshot: any = {};
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** Set the paramMap observables's next value */
  public setParamMap(params?: Params): void {
    this.subject.next(convertToParamMap(params));
    this.snapshot.paramMap = convertToParamMap(params);
  }

}
