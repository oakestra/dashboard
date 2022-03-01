import {Injectable} from '@angular/core';
import {SurveyNotificationComponent} from "./survey-notification.component";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})

export class SurveyNotificationService {

  massage = ""
  taskNumber = 0

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private snackBar: MatSnackBar) {
  }

  notify(taskNumber:number) {
    this.taskNumber = taskNumber;

    this.snackBar.openFromComponent(SurveyNotificationComponent, {
      panelClass: ['blue-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}

