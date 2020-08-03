import { ComponentFixture } from '@angular/core/testing';

/**
 * Helps to get template elements within component testing.
 */
export class TemplateHelper<T> {

  constructor(public fixture: ComponentFixture<T>) {
  }

  public query<E>(selector: string): E {
    return this.fixture.nativeElement.querySelector(selector);
  }

  public queryAll<E>(selector: string): E[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }

}
