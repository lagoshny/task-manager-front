import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { QuickTaskCreateComponent } from './components/quick-task-create/quick-task-create.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskComponent } from './components/task/task.component';
import { TimeIconComponent } from './components/task/time-icon/time-icon.component';
import { TaskService } from './services/task.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        NgxValidationMessagesModule
    ],
    declarations: [
        QuickTaskCreateComponent,
        TaskComponent,
        TimeIconComponent,
        TaskListComponent
    ],
    providers: [
        TaskService
    ],
    exports: [TaskListComponent]
})
export class TasksModule {
}
