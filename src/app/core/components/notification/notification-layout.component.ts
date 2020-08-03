import { Component, Inject } from '@angular/core';
import { NotificationType } from '../../models/notification-type.model';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './notification-layout.component.html',
  styleUrls: ['./notification-layout.component.scss']
})
export class NotificationLayoutComponent {

  public title: string;

  public messages: Array<string> = [];

  public type = NotificationType.SUCCESS;

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: any,
              private snackBar: MatSnackBar) {
    this.title = data.title;
    this.messages = data.messages;
    if (data.type) {
      this.type = data.type;
    }
  }

  public onCloseClick(): void {
    this.snackBar.dismiss();
  }
}
