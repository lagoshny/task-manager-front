import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderModule } from './header/header.module';

@Component({
  selector: 'tm-app',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    HeaderModule,
  ],
  standalone: true,
})
export class AppComponent {

  constructor(public router: Router) {
  }

}
