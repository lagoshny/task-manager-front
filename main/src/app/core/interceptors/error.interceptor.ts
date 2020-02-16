import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

/**
 * Common HTTP interceptor to handle server errors.
 * When server errors occurs then show their in material {@link MatSnackBar} with {@link NotificationLayoutComponent}.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private logger: NGXLogger,
                private notificationService: NotificationService) {
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
                                this.notificationService.showErrors(messages);
                            } else {
                                this.notificationService.showErrors([responseError.message]);
                            }
                        }
                    })
            );
    }

}
