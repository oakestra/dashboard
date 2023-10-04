import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationType } from '../../../root/interfaces/notification';
import { NotificationComponent } from './notification.component';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    massage = '';
    type = 0;
    panelClass: any;

    constructor(private snackBar: MatSnackBar) {}

    notify(type: NotificationType, data: any) {
        this.type = type;
        this.massage = data;

        if (type === NotificationType.error) {
            this.panelClass = ['error-snackbar'];
        } else if (type === NotificationType.success) {
            this.panelClass = ['success-snackbar'];
        } else {
            this.panelClass = ['warn-snackbar'];
        }

        this.snackBar.openFromComponent(NotificationComponent, {
            panelClass: this.panelClass,
            duration: 3000,
        });
    }
}
