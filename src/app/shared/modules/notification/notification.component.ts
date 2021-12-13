import {Component, OnInit} from '@angular/core';
import {NotificationService} from "./notification.service";

@Component({
  selector: 'app-notification',
  template: `
    <div style="text-align: center;">
    <mat-icon *ngIf="type == 0">error</mat-icon>
    <mat-icon *ngIf="type == 1">info</mat-icon>
    <mat-icon *ngIf="type == 2">check_circle</mat-icon>
    <p class="addButtonDiv">  {{massage}}</p>
    </div>
    `,
  styles: [`
  .addButtonDiv {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }`]
})
export class NotificationComponent implements OnInit {

  constructor(private notification: NotificationService) {
  }

  massage = "random"
  type = 1

  ngOnInit(): void {
    this.massage = this.notification.massage;
    this.type = this.notification.type
  }
}
