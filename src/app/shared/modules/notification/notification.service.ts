import {Injectable} from '@angular/core';
import {NotificationComponent} from "./notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  massage = ""
  type = 0;
  panelClass: any
  constructor(private snackBar: MatSnackBar) {
  }

  notify(type: Type, data: any) {
    this.massage = data
    this.type = type

    if(type == Type.error){
      this.panelClass = ['error-snackbar']
    }else if (type == Type.success) {
      this.panelClass = ['success-snackbar']
    }

    this.snackBar.openFromComponent(NotificationComponent, {
      panelClass: this.panelClass,
      duration: 3000,
    });
  }
}

export enum Type{
  error,
  information,
  success
}

