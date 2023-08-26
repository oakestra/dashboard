import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
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
    currentTheme = 'default';

    themes = [
        {
            value: 'default',
            name: 'Light',
        },
        {
            value: 'dark',
            name: 'Dark',
        },
        {
            value: 'cosmic',
            name: 'Cosmic',
        },
        {
            value: 'corporate',
            name: 'Corporate',
        },
    ];

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));

    constructor(
        private fb: FormBuilder,
        public dialog: NbDialogService,
        private userService: UserService,
        private store: Store<appReducer.AppState>,
        private themeService: NbThemeService,
        private cookieService: CookieService,
    ) {
        this.form = fb.group({
            email: ['', Validators.email],
        });
    }

    ngOnInit(): void {
        this.currentTheme = this.themeService.currentTheme;
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
        this.dialog.open(DialogChangePasswordView, { context: { data } });
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
        const data = { theme: themeName };
        this.cookieService.set('themeCookie', JSON.stringify(data));
    }

    public getRoleBackgroundColor(role: string): string {
        switch (role) {
            case 'Admin':
                return '#DE686B';
            case 'Application_Provider':
                return '#3DA23C';
            case 'Organization_Admin':
                return '#ADA23C';
            case 'Infrastructure_Provider':
                return '#395bb2';
            default:
                return '#c4c4c5';
        }
    }
}
