import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'tm-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(public router: Router) {
    }

}
