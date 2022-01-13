import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordToken: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";

  form = new FormGroup({
    "newPass": new FormControl("", Validators.required),
    "confirmPass": new FormControl("", Validators.required)
  })

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private api: ApiService,
              private notifyService: NotificationService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const paramToken = params['resetPasswordToken'];
      if (paramToken) {
        this.resetPasswordToken = paramToken;
        console.log(paramToken)
      } else {
        this.router.navigate(["/"]);
      }
    })
  }

  get samePasswords(){
    return this.form.get('newPass')?.value == this.form.get('confirmPass')?.value
  }


  public submitNewPassword(): void {
    // if (!(this.newPassword) || !(this.confirmNewPassword)
    //   || this.confirmNewPassword.length === 0 || this.newPassword.length === 0) {
    //   // this.notify.error("Error", "Password can't be empty!");
    // } else if (this.newPassword !== this.confirmNewPassword) {
    //   // this.notify.error("Error", "Confirmed password and new password aren't the same!");
    // } else {
      this.api.saveResetPassword(this.resetPasswordToken, this.newPassword).subscribe(() => {
        this.notifyService.notify(Type.success, "New password saved!")
      }, (e) => console.log(e));
      // this.router.navigate(["/"]);
    }
  // }

}
