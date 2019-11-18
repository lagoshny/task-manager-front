import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../core/core.module';
import { CategoryComponent } from './category.component';

describe("CategoryComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              CoreModule
            ],
            declarations: [
                CategoryComponent
            ]
        }).compileComponents();
    }));

    let fixture;
    let comp: CategoryComponent;
    beforeEach(() => {
        fixture = TestBed.createComponent(CategoryComponent);
        comp = fixture.componentInstance;
    });

    it("should create the comp", () => {
        expect(comp).toBeTruthy();
    })

});