import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoreModule } from '../core/core.module';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryService } from './services/category.service';
import { NgxValidationMessagesComponent } from '@lagoshny/ngx-validation-messages';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxValidationMessagesComponent,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    CategoryFormComponent
  ],
  providers: [
    CategoryService
  ],
  exports: [CategoryListComponent, CategoryFormComponent]
})
export class CategoriesModule {
}
