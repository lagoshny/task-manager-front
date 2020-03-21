import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryFormComponent } from './categories/components/category-form/category-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { TaskFormComponent } from './tasks/components/task-form/task-form.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'categories',
                children: [
                    {
                        path: 'new',
                        component: CategoryFormComponent
                    },
                    {
                        path: 'edit/:prefix',
                        component: CategoryFormComponent
                    }
                ]
            },
            {
                path: 'tasks',
                children: [
                    {
                        path: 'new',
                        component: TaskFormComponent
                    },
                    {
                        path: 'edit/:taskCategoryNumber',
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
