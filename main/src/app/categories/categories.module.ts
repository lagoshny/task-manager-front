import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryService } from './services/category.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [
        CategoryComponent,
        CategoryListComponent
    ],
    providers: [
        CategoryService
    ],
    exports: [CategoryListComponent]
})
export class CategoriesModule {
}
