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
        this.massage = typeof data === 'string' ? data : data?.message || 'Unexpected error';

        if (type === NotificationType.error) {
            this.panelClass = ['error-snackbar'];
        } else if (type === NotificationType.success) {
            this.panelClass = ['success-snackbar'];
        } else {
            this.panelClass = ['warn-snackbar'];
        }

        try {
            this.snackBar.openFromComponent(NotificationComponent, {
                panelClass: this.panelClass,
                duration: 3000,
            });
        } catch {
            // No-op fallback: avoid breaking user flow when an overlay container is unavailable.
        }
    }
}
