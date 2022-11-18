import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/modules/api/api.service';
import { NotificationService, Type } from '../../shared/modules/notification/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form = new FormGroup({
    newPass: new FormControl('', Validators.required),
    confirmPass: new FormControl('', Validators.required),
  });

  private resetPasswordToken = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const paramToken = params['resetPasswordToken'];
      if (paramToken) {
        this.resetPasswordToken = paramToken;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  get samePasswords() {
    return this.form.get('newPass')?.value == this.form.get('confirmPass')?.value;
  }

  public submitNewPassword(): void {
    const pass = this.form.get('newPass')?.value as string;
    this.api.saveResetPassword(this.resetPasswordToken, pass).subscribe(
      () => {
        this.notifyService.notify(Type.success, 'New password saved!');
        this.router.navigate(['/']);
      },
      (e) => console.log(e),
    );
  }
}
