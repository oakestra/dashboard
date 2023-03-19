import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/modules/api/api.service';
import { DialogEditUserView } from '../dialogs/edit-user/dialogEditUser';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { DialogConfirmationView } from '../dialogs/confirmation/dialogConfirmation';
import { IUser } from '../../root/interfaces/user';
import { DialogAction } from '../../root/enums/dialogAction';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { appReducer, deleteUser, getAllUser, postUser, updateUser } from '../../root/store';
import { selectAllUser } from '../../root/store/selectors/user.selector';
import { Role } from '../../root/enums/roles';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
    DialogAction = DialogAction;
    displayedColumns: string[] = ['name', 'created_at', 'roles', 'symbol'];
    searchedUsers: Array<IUser> = [];
    searchText = '';
    selectedItems = [''];
    dropdown = new FormControl();
    dropdownList: string[] = [];

    public users$: Observable<IUser[]> = this.store.pipe(select(selectAllUser));

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
    ) {}

    ngOnInit() {
        this.dropdownList = Object.keys(Role);
        this.loadData();
        this.store.dispatch(getAllUser());
    }

    loadData(): void {
        this.route.queryParams.subscribe((params) => {
            this.searchText = params.searchText;
            this.selectedItems = [];

            if (params.searchRoles) {
                let searchRoles = [];
                if (Array.isArray(params.searchRoles)) {
                    searchRoles = params.searchRoles;
                } else {
                    searchRoles.push(params.searchRoles);
                }
                this.dropdown.patchValue(searchRoles);
                searchRoles.forEach((searched) => {
                    const found = this.dropdownList.find((role) => role === searched) ?? '';
                    this.selectedItems.push(found);
                });
            }
            this.doFilter();
        });
    }

    search(): void {
        const queryParams: { searchText: string; searchRoles: string[] } = { searchText: '', searchRoles: [] };
        if (this.searchText && this.searchText.length > 0) {
            queryParams.searchText = this.searchText;
        }

        this.selectedItems = this.dropdown.value;
        if (this.selectedItems) {
            this.selectedItems.forEach((role: string) => {
                queryParams.searchRoles.push(role);
            });
        }
        void this.router.navigate(['control', 'users'], { queryParams, queryParamsHandling: 'merge' }).then();
    }

    doFilter(): void {
        this.users$.subscribe((u) => {
            this.searchedUsers = u.filter((user) => this.nameFilter(user) && this.roleFilter(user));
        });
    }

    nameFilter(user: IUser): boolean {
        return (
            !this.searchText ||
            this.searchText.length === 0 ||
            user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
        );
    }

    roleFilter(user: IUser): boolean {
        return (
            !this.selectedItems ||
            this.selectedItems.length === 0 ||
            this.selectedItems.some(
                (searchedRole: string) =>
                    (searchedRole === 'None' && user.roles.length === 0) ||
                    user.roles.some((role) => role === searchedRole),
            )
        );
    }

    deleteUser(user: IUser): void {
        this.store.dispatch(deleteUser({ user }));
        this.doFilter();
    }

    openDeleteDialog(obj: IUser) {
        const data = {
            text: 'Delete user: ' + obj.name,
            type: 'user',
        };
        const dialogRef = this.dialog.open(DialogConfirmationView, { data });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === true) {
                this.deleteUser(obj);
            }
        });
    }

    openDialog(action: DialogAction, user?: IUser) {
        if (action === DialogAction.ADD) {
            user = {
                // New UserEntity
                _id: { $oid: '' },
                created_at: '',
                email: '',
                name: '',
                password: '',
                roles: [],
            };
        }

        const data: IDialogAttribute = {
            content: user,
            action,
        };
        const dialogRef = this.dialog.open(DialogEditUserView, { data });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === DialogAction.ADD) {
                this.store.dispatch(postUser({ user: result.data }));
            } else if (result.event === DialogAction.UPDATE) {
                this.store.dispatch(updateUser({ user: result.data }));
            }
        });
    }
}
