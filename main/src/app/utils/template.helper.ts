import { ComponentFixture } from '@angular/core/testing';

/**
 * Helps to get template elements within component testing.
 */
export class TemplateHelper<T> {

    constructor(public fixture: ComponentFixture<T>) {
    }

    public query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }

    public queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }

}