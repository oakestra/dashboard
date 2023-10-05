import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../root/interfaces/notification';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    template: `
        <div class="center">
            <mat-icon class="notification-icon" *ngIf="type === Type.error">error</mat-icon>
            <mat-icon class="notification-icon" *ngIf="type === Type.information">info</mat-icon>
            <mat-icon class="notification-icon" *ngIf="type === Type.success">check_circle</mat-icon>
            <p class="addButtonDiv">{{ massage }}</p>
        </div>
    `,
    styles: [
        `
            .center {
                text-align: center;
            }

            .addButtonDiv {
                display: inline-block;
                vertical-align: middle;
                text-align: center;
            }

            .notification-icon {
                margin-right: 7px;
            }
        `,
    ],
})
export class NotificationComponent implements OnInit {
    Type = NotificationType;
    massage = '';
    type = NotificationType.information;

    constructor(private notification: NotificationService) {}

    ngOnInit(): void {
        this.massage = this.notification.massage;
        this.type = this.notification.type;
    }
}
