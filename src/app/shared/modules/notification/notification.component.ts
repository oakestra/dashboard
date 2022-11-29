import { Component, OnInit } from '@angular/core';
import { NotificationService, Type } from './notification.service';

@Component({
    selector: 'app-notification',
    template: `
        <div class="center">
            <mat-icon *ngIf="type === Type.error">error</mat-icon>
            <mat-icon *ngIf="type === Type.information">info</mat-icon>
            <mat-icon *ngIf="type === Type.success">check_circle</mat-icon>
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
    Type = Type;
    massage = '';
    type = Type.information;

    constructor(private notification: NotificationService) {}

    ngOnInit(): void {
        this.massage = this.notification.massage;
        this.type = this.notification.type;
    }
}
