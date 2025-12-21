import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'tm-app',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
  ],
  standalone: true,
})
export class AppComponent {

  constructor(public router: Router) {
  }

}
