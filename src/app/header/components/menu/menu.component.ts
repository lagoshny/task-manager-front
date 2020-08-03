import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';

@Component({
    selector: 'tm-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public static HOME = new MenuItem('Home', '/home', 'fa-home');
    public static CREATE_TASK = new MenuItem('Create task', '/tasks/new', 'fa-plus');

    public menuItems: Array<MenuItem> = [];

    public ngOnInit(): void {
        this.menuItems.push(MenuComponent.HOME);
        this.menuItems.push(MenuComponent.CREATE_TASK);
    }

}
