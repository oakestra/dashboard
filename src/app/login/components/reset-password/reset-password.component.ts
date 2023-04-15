import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { NotificationType } from '../../../root/interfaces/notification';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
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
            const paramToken = params.resetPasswordToken;
            if (paramToken) {
                this.resetPasswordToken = paramToken;
            } else {
                void this.router.navigate(['/']);
            }
        });
    }

    get samePasswords() {
        return this.form.get('newPass')?.value === this.form.get('confirmPass')?.value;
    }

    public submitNewPassword(): void {
        const pass = this.form.get('newPass')?.value;
        this.api.saveResetPassword(this.resetPasswordToken, pass).subscribe(
            () => {
                this.notifyService.notify(NotificationType.success, 'New password saved!');
                void this.router.navigate(['/']);
            },
            (e) => console.log(e),
        );
    }
}
