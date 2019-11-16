import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerNotificationComponent } from '../components/server-notification/server-notification.component';
import { NotificationType } from '../models/notification-type.model';

/**
 * Common HTTP interceptor to handle server errors.
 * When server errors occurs then show their in material {@link MatSnackBar} with {@link ServerNotificationComponent}.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private logger: NGXLogger,
                private _snackBar: MatSnackBar) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                tap((/* event: HttpEvent<any> */) => {
                    },
                    (responseError: any) => {
                        if (responseError instanceof HttpErrorResponse) {
                            this.logger.error(responseError);
                            if (responseError.error && responseError.error.messages) {
                                const messages = _.map(responseError.error.messages, (serverError: string) => {
                                    return serverError;
                                });
                                this.showErrors(messages);
                            } else {
                                this.showErrors([responseError.message]);
                            }
                        }
                    })
            );
    }

    private showErrors(messages: Array<string>): void {
        if (!_.isEmpty(messages)) {
            this._snackBar.openFromComponent(ServerNotificationComponent,
                {
                    data: {title: 'Error', messages, type: NotificationType.ERROR},
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 5000
                });
        }
    }

}
