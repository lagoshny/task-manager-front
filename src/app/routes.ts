import { Routes } from '@angular/router';
import { CategoryFormComponent } from './categories/components/category-form/category-form.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { TaskFormComponent } from './tasks/components/task-form/task-form.component';
import { UserFromComponent } from './users/components/user-from/user-from.component';
import { LoginComponent } from './login/login.component';
import { loginGuard } from './login/guards/login.guard';
import { RegistrationFormComponent } from './login/components/registration-form/registration-form.component';
import { LoginFormComponent } from './login/components/login-form/login-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    children: [
      {
        path: 'registration',
        component: RegistrationFormComponent
      },
      {
        path: '',
        component: LoginFormComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
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
