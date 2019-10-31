import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { QuickTaskCreateComponent } from './components/quick-task-create/quick-task-create.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskComponent } from './components/task/task.component';
import { TimeIconComponent } from './components/task/time-icon/time-icon.component';
import { TaskCategoryService } from './services/task-category.service';
import { TaskService } from './services/task.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        NgxValidationMessagesModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    declarations: [
        QuickTaskCreateComponent,
        TaskComponent,
        TimeIconComponent,
        TaskListComponent,
        TaskFormComponent
    ],
    providers: [
        TaskService,
        TaskCategoryService
    ],
    exports: [TaskListComponent]
})
export class TasksModule {
}
