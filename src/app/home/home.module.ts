import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CategoriesModule } from '../categories/categories.module';
import { TasksModule } from '../tasks/tasks.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    CategoriesModule,
    TasksModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {
}
