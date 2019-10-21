import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TasksModule } from '../tasks/tasks.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
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
