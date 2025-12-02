import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../core/services/auth.service';
import { StringUtils } from '../core/utils/string.utils';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'tm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MenuComponent,
    RouterLink,
  ]
})
export class HeaderComponent implements OnInit {

  public userName = StringUtils.EMPTY;

  constructor(private authService: AuthService,
              private router: Router,
              // private logger: NGXLogger,
              ) {
  }

  public ngOnInit(): void {
    this.userName = this.authService.getUser().username;
  }

  public logout(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
      // .catch(reason => {this.logger.error(reason);});
  }

}
