import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../shared/modules/api/api.service';
import { DialogEditUserView } from '../dialogs/edit-user/dialogEditUser';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { DialogConfirmationView } from '../dialogs/confirmation/dialogConfirmation';
import { IUser, IUserRole } from '../../root/interfaces/user';
import { DialogAction } from '../../root/enums/dialogAction';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { NotificationType } from '../../root/interfaces/notification';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
    DialogAction = DialogAction;
    displayedColumns: string[] = ['name', 'created_at', 'roles', 'symbol'];

    users: Array<IUser> = [];
    searchedUsers: Array<IUser> = [];
    searchText = '';
    selectedItems = [''];
    dropdown = new FormControl();
    dropdownList: string[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private notifyService: NotificationService,
    ) {}

    ngOnInit() {
        this.dropdownList = this.api.getRoles().map((roles) => roles.name);
        this.loadData();
    }

    loadData(): void {
        this.api.getAllUser().subscribe((users: IUser[]) => {
            this.users = users;
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
        this.searchedUsers = this.users.filter((user) => this.nameFilter(user) && this.roleFilter(user));
    }

    nameFilter(user: IUser): boolean {
        return (
            !this.searchText
            || this.searchText.length === 0
            || user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
        );
    }

    roleFilter(user: IUser): boolean {
        return (
            !this.selectedItems
            || this.selectedItems.length === 0
            || this.selectedItems.some(
                (searchedRole: string) =>
                    (searchedRole === 'None' && user.roles.length === 0)
                    || user.roles.some((role: IUserRole) => role.name === searchedRole),
            )
        );
    }

    deleteUser(user: IUser): void {
        this.api.deleteUser(user).subscribe({
            next: () => {
                this.notifyService.notify(NotificationType.success, 'User ' + user.name + ' deleted successfully!');
                this.loadData();
            },
            error: () => {
                this.notifyService.notify(NotificationType.error, 'Error: Deleting user ' + user.name + ' failed!');
            },
        });
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

    openDialog(action: DialogAction, user: IUser | undefined) {
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
            if (result.event === 'add') {
                this.addUser(result.data);
            } else if (result.event === 'edit') {
                this.updateUser(result.data);
            }
        });
    }

    updateUser(user: IUser) {
        this.api.updateUser(user).subscribe(() => this.loadData());
    }

    addUser(user: IUser) {
        if (user.name.length !== 0 && user.password.length !== 0) {
            user.created_at = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') ?? '';
            this.api.registerUser(user).subscribe({
                next: () => {
                    this.notifyService.notify(NotificationType.success, 'User registered successfully.');
                    this.loadData();
                },
                error: (error) => {
                    this.notifyService.notify(NotificationType.error, error.error.message);
                },
            });
        } else {
            this.notifyService.notify(NotificationType.error, 'Please provide valid inputs for user registration.');
        }
    }
}
