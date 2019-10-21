import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { QuickTaskCreateComponent } from './components/quick-task-create/quick-task-create.component';
import { TaskService } from './services/task.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        NgxValidationMessagesModule
    ],
    declarations: [
        QuickTaskCreateComponent
    ],
    providers: [
        TaskService
    ],
    exports: [QuickTaskCreateComponent]
})
export class TasksModule {
}
