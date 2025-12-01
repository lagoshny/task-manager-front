import { Routes } from '@angular/router';
import { CategoryFormComponent } from './categories/components/category-form/category-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { TaskFormComponent } from './tasks/components/task-form/task-form.component';
import { UserFromComponent } from './users/components/user-from/user-from.component';

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
        path: 'users',
        component: UserFromComponent
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
