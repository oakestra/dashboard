import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogChangePasswordView } from '../../dialogs/change-password/dialogChangePassword';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../shared/modules/auth/user.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { Router } from '@angular/router';
import { NotificationService, Type } from '../../../shared/modules/notification/notification.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  user: any;
  dataReady = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private api: ApiService,
    private router: Router,
    private notifyService: NotificationService,
  ) {
    this.form = fb.group({
      email: ['', Validators.email],
    });
  }

  ngOnInit(): void {
    const username = this.userService.getUsername();
    this.api.getUserByName(username).subscribe((data: any) => {
      this.user = data;
      this.dataReady = true;
      this.form.patchValue({ email: this.user.email });
    });
  }

  onSubmit() {
    this.user.email = this.form.get('email')?.value;
    this.api.updateUser(this.user).subscribe(() => {
      this.notifyService.notify(Type.success, 'Changes saved successfully');
      this.router.navigate(['/control']);
    });
  }

  openDialog(obj: any) {
    this.dialog.open(DialogChangePasswordView, { data: obj });
  }
}
