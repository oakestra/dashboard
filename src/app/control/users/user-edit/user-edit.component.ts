import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DialogChangePasswordView } from '../../dialogs/change-password/dialogChangePassword';
import { UserService } from '../../../shared/modules/auth/user.service';
import { IUser } from '../../../root/interfaces/user';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';
import { appReducer, getUser, updateUser } from '../../../root/store';
import { selectCurrentUser } from '../../../root/store/selectors/user.selector';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
    form: FormGroup;
    user: IUser;

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private userService: UserService,
        private router: Router,
        private store: Store<appReducer.AppState>,
    ) {
        this.form = fb.group({
            email: ['', Validators.email],
        });
    }

    ngOnInit(): void {
        this.store.dispatch(getUser({ name: this.userService.getUsername() }));

        this.user$.subscribe((u: IUser) => {
            this.user = u;
            this.form.patchValue({ email: this.user.email });
        });
    }

    onSubmit() {
        const updatedUser: IUser = {
            ...this.user,
            email: this.form.get('email')?.value,
        };
        this.store.dispatch(updateUser({ user: updatedUser }));
    }

    openDialog(user: IUser) {
        const data: IDialogAttribute = {
            content: user,
        };
        this.dialog.open(DialogChangePasswordView, { data });
    }
}
