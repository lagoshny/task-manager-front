import { Component, Input } from '@angular/core';
import { TaskCategory } from '../../../core/models/task-category.model';

@Component({
    selector: 'tm-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

    @Input()
    public category: TaskCategory;

    public categoryMenuOpacity = 0;

    public isCategoryActive = false;

    public onChangeCategoryMenuOpacity(value: number): void {
        this.categoryMenuOpacity = value;
    }

}
