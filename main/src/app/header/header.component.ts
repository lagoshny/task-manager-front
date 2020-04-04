import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../core/services/auth.service';
import { StringUtils } from '../core/utils/string.utils';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public userName = StringUtils.EMPTY;

    constructor(private authService: AuthService,
                private router: Router,
                private logger: NGXLogger) {
    }

    public ngOnInit(): void {
        this.userName = this.authService.getUser().username;
    }

    public logout(): void {
        this.authService.logOut();
        this.router.navigate(['/login']).catch(reason => {
            this.logger.error(reason);
        });
    }

}
