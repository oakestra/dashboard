import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../root/interfaces/notification';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    template: `
        <div class="center">
            <nb-icon class="notification-icon" *ngIf="type === Type.error" icon="alert-circle-outline"></nb-icon>
            <nb-icon
                class="notification-icon"
                *ngIf="type === Type.information"
                icon="alert-triangle-outline"
            ></nb-icon>
            <nb-icon
                class="notification-icon"
                *ngIf="type === Type.success"
                icon="checkmark-circle-2-outline"
            ></nb-icon>
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
