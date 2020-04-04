import { Component, Input } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';

@Component({
    selector: 'tm-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {

    @Input()
    public item: MenuItem;

}
