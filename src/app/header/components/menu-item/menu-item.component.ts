import { Component, Input } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'tm-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkWithHref,
  ]
})
export class MenuItemComponent {

  @Input()
  public item: MenuItem;

}
