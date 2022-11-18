import { Component, Inject, OnInit } from '@angular/core';
import { SurveyNotificationService } from './survey-notification.service';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  templateUrl: './survey-notification.html',
})
export class SurveyNotificationComponent implements OnInit {
  massage = '';
  taskNumber = 0;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data: any,
    private notification: SurveyNotificationService,
    private _snackRef: MatSnackBarRef<SurveyNotificationComponent>,
  ) {}

  ngOnInit(): void {
    this.taskNumber = this.notification.taskNumber;
  }

  dismiss() {
    this._snackRef.dismiss();
  }
}
