import { Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { TaskCategory } from '../../../core/models/task-category.model';
import { CategoryComponent } from './category.component';

@Pipe({
    name: 'amountCharacters'
})
class AmountCharactersPipeStub implements PipeTransform {

    public transform(value: any, ...args: any[]): any {
    }

}

describe("CategoryComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CategoryComponent,
                AmountCharactersPipeStub
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
    });

    it("#onChangeCategoryMenuOpacity() should change opacity", () => {
        comp.onChangeCategoryMenuOpacity(1);
        expect(comp.categoryMenuOpacity).toBe(1);
    });

    it("#categoryEdit should raises clicked event", () => {
        const taskCategory = new TaskCategory();
        comp.category = taskCategory;
        comp.categoryEdit.subscribe((categoryToEdit: TaskCategory) => {
            expect(categoryToEdit).toBe(taskCategory);
        });
        comp.categoryEdit.emit(taskCategory);
    })


});