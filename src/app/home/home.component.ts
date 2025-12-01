import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { TaskListComponent } from '../tasks/components/task-list/task-list.component';
import { CategoryListComponent } from '../categories/components/category-list/category-list.component';

@Component({
  selector: 'tm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [trigger('routerTransition', [
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
    ])
  ])],
  standalone: true,
  imports: [
    TaskListComponent,
    CategoryListComponent
  ]
})
export class HomeComponent {
}
