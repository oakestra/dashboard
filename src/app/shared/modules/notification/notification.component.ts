import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="center">
      <mat-icon *ngIf="type === 0">error</mat-icon>
      <mat-icon *ngIf="type === 1">info</mat-icon>
      <mat-icon *ngIf="type === 2">check_circle</mat-icon>
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
  massage = '';
  type = 1;

  constructor(private notification: NotificationService) {}

  ngOnInit(): void {
    this.massage = this.notification.massage;
    this.type = this.notification.type;
  }
}
