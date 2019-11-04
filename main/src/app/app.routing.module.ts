import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaskFormComponent } from './tasks/components/task-form/task-form.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'tasks',
                children: [
                    {
                        path: 'new',
                        component: TaskFormComponent
                    },
                    {
                        path: 'edit/:taskID',
                        component: TaskFormComponent
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
