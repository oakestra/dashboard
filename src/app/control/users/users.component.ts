import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { ApiService } from '../../shared/modules/api/api.service';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { DialogConfirmationView } from '../../root/components/dialogs/confirmation/dialogConfirmation';
import { IUser } from '../../root/interfaces/user';
import { DialogAction } from '../../root/enums/dialogAction';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { appReducer, deleteUser, getAllUser, postUser, updateUser } from '../../root/store';
import { selectAllUser } from '../../root/store/selectors/user.selector';
import { Role } from '../../root/enums/roles';
import { UserService } from '../../shared/modules/auth/user.service';
import { DialogEditUserView } from './dialogs/edit-user/dialogEditUser';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    DialogAction = DialogAction;
    displayedColumns: string[] = ['name', 'created_at', 'roles', 'symbol'];
    searchedUsers: Array<IUser> = [];
    searchText = '';
    selectedItems: string[] = [];
    dropdown = new FormControl([]);
    dropdownList: string[] = [];
    allUsers: IUser[] = [];

    public users$: Observable<IUser[]> = this.store.pipe(select(selectAllUser));

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
        private dialog: NbDialogService,
        private datePipe: DatePipe,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.dropdownList = Object.values(Role);
        const organization_id = this.userService.getOrganization();
        this.store.dispatch(getAllUser({ organization_id }));

        this.users$.subscribe((users) => {
            this.allUsers = users || [];
            this.applyFilter();
        });

        // Load data from URL params first, then do initial filter
        this.loadData();
    }

    loadData(): void {
        this.route.queryParams.subscribe((params) => {
            this.searchText = params.searchText || '';
            this.selectedItems = [];

            if (params.searchRoles) {
                const searchRoles = Array.isArray(params.searchRoles) ? params.searchRoles : [params.searchRoles];
                this.dropdown.patchValue(searchRoles);
                this.selectedItems = searchRoles;
            }
            this.applyFilter();
        });
    }

    // New helper method to handle the actual filtering logic
    applyFilter(): void {
        this.searchedUsers = this.allUsers.filter((user) => this.nameFilter(user) && this.roleFilter(user));
    }

    doFilter(value: any): void {
        // If the input is a string, it's from the search box
        if (typeof value === 'string') {
            this.searchText = value;
        }
        // Always sync selectedItems with the current form state
        this.selectedItems = this.dropdown.value || [];
        this.applyFilter();
    }

    nameFilter(user: IUser): boolean {
        if (!user || !user.name) {
            return false;
        }
        return (
            !this.searchText ||
            this.searchText.length === 0 ||
            user.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    roleFilter(user: IUser): boolean {
        if (!this.selectedItems || this.selectedItems.length === 0) {
            return true;
        }
        return this.selectedItems.some(
            (searchedRole: string) =>
                (searchedRole === 'None' && (!user.roles || user.roles.length === 0)) ||
                (user.roles && user.roles.includes(searchedRole as any))
        );
    }

    deleteUser(user: IUser): void {
        this.store.dispatch(deleteUser({ user }));
        // Refresh filter after delete
        setTimeout(() => this.applyFilter(), 200);
    }

    openDeleteDialog(obj: IUser) {
        const data = {
            text: 'Delete user: ' + obj.name,
            type: 'user',
        };

        const dialogRef = this.dialog.open(DialogConfirmationView, { context: data });
        dialogRef.onClose.subscribe((res) => {
            if (res && res.event === true) {
                this.deleteUser(obj);
            }
        });
    }

    openDialog(action: DialogAction, user?: IUser) {
        if (action === DialogAction.ADD) {
            user = { _id: '', created_at: '', email: '', name: '', password: '', roles: [] };
        }

        const data: IDialogAttribute = { content: user, action };
        const dialogRef = this.dialog.open(DialogEditUserView, { context: { data } });

        dialogRef.onClose.subscribe((result) => {
            if (!result) {
                return;
            }
            if (result.event === DialogAction.ADD) {
                this.store.dispatch(postUser({ user: result.data }));
            } else if (result.event === DialogAction.UPDATE) {
                this.store.dispatch(updateUser({ user: result.data }));
            }
            setTimeout(() => this.applyFilter(), 500);
        });
    }

    resetSearch() {
        this.searchText = '';
        this.dropdown.setValue([]);
        this.selectedItems = [];
        this.applyFilter();
    }
}
