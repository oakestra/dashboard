import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../../root/interfaces/notification';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    template: `
        <div class="center">
            <nb-icon *ngIf="type === Type.error" icon="alert-circle-outline"></nb-icon>
            <nb-icon *ngIf="type === Type.information" icon="alert-triangle-outline"></nb-icon>
            <nb-icon *ngIf="type === Type.success" icon="checkmark-circle-2-outline"></nb-icon>
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
