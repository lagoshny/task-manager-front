import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'tm-app',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
    ]
})
export class AppComponent {

  constructor(public router: Router) {
  }

}
