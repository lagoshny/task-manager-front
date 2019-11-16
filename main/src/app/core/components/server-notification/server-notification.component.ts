import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';
import { NotificationType } from '../../models/notification-type.model';

@Component({
    selector: 'tm-server-notification',
    templateUrl: './server-notification.component.html',
    styleUrls: ['./server-notification.component.scss']
})
export class ServerNotificationComponent {

    public title: string;

    public messages: Array<string> = [];

    public type = NotificationType.SUCCESS;

    constructor(@Inject(MAT_SNACK_BAR_DATA) data: any,
                private _snackBar: MatSnackBar) {
        this.title = data.title;
        this.messages = data.messages;
        if (data.type) {
            this.type = data.type;
        }
    }

    public onCloseClick(): void {
        this._snackBar.dismiss();
    }
}
