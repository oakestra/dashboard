import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../../shared/modules/auth/user.service';
import { IUser } from '../../root/interfaces/user';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { appReducer, getUser, updateUser } from '../../root/store';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';
import { DialogChangePasswordView } from './dialogs/change-password/dialogChangePassword';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    form: FormGroup;
    user: IUser;
    isDarkMode;

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private userService: UserService,
        private router: Router,
        private store: Store<appReducer.AppState>,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
    ) {
        this.form = fb.group({
            email: ['', Validators.email],
        });

        this.isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
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

    onDarkModeSwitched({ checked }: MatSlideToggleChange) {
        console.log(checked);
        localStorage.setItem('darkMode', String(checked));
        const hostClass = checked ? 'theme-dark' : 'theme-light';
        this.renderer.setAttribute(this.document.body, 'class', hostClass);
    }
}
