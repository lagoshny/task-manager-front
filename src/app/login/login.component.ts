import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class LoginComponent {
}

