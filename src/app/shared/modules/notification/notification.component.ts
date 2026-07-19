import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../root/interfaces/notification';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    template: `
        <div class="center">
            <span class="notification-icon" *ngIf="type === Type.error">!</span>
            <span class="notification-icon" *ngIf="type === Type.information">i</span>
            <span class="notification-icon" *ngIf="type === Type.success">v</span>
            <p class="notification-text">{{ massage }}</p>
        </div>
    `,
    styles: [
        `
            .center {
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-text {
                margin: 0;
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
