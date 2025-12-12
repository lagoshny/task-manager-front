import { convertToParamMap, ParamMap, Params } from '@angular/router';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  snapshot: { paramMap: ParamMap };

  constructor(initialParams: Params = {}) {
    this.snapshot = {
      paramMap: convertToParamMap(initialParams)
    };
  }

  setParamMap(params: Params = {}): void {
    this.snapshot = {
      paramMap: convertToParamMap(params)
    };
  }
}
