import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { NotificationLayoutComponent } from '../components/notification/notification-layout.component';
import { NotificationType } from '../models/notification-type.model';

@Injectable()
export class NotificationService {

    constructor(private snackBar: MatSnackBar) {
    }

    public showSuccess(messages: Array<string>, duration: number = 2000): void {
        if (!_.isEmpty(messages)) {
            this.snackBar.openFromComponent(NotificationLayoutComponent,
                {
                    data: {title: 'Success', messages, type: NotificationType.SUCCESS},
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: duration
                });
        }
    }

    public showErrors(messages: Array<string>, duration: number = 2000): void {
        if (!_.isEmpty(messages)) {
            this.snackBar.openFromComponent(NotificationLayoutComponent,
                {
                    data: {title: 'Error', messages, type: NotificationType.ERROR},
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: duration
                });
        }
    }

}