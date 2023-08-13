import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { NbDialogService } from '@nebular/theme';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
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
        private dialog: NbDialogService,
        private datePipe: DatePipe,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.dropdownList = Object.keys(Role);
        this.loadData();
        const organization_id = this.userService.getOrganization();
        console.log(organization_id);
        this.store.dispatch(getAllUser({ organization_id }));
        this.users$.subscribe((x) => console.log(x));
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
            this.doFilter('');
        });
    }
    /*
    search(event: any) {
        this.searchedMember = this.member.filter(
            (m) => m.name.toLowerCase().indexOf(event?.toLowerCase() ?? '') !== -1,
        );
    }
*/
    doFilter($event: any): void {
        this.searchText = $event;
        this.users$.subscribe((u) => {
            this.searchedUsers = u.filter((user) => this.nameFilter(user) && this.roleFilter(user));
        });
    }

    nameFilter(user: IUser): boolean {
        console.log(this.searchText);
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
        this.doFilter(this.searchText);
    }

    openDeleteDialog(obj: IUser) {
        const data = {
            text: 'Delete user: ' + obj.name,
            type: 'user',
        };

        const dialogRef = this.dialog.open(DialogConfirmationView, { context: data });
        dialogRef.onClose.subscribe((result) => {
            if (result === true) {
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
        console.log(data);
        const dialogRef = this.dialog.open(DialogEditUserView, { context: { data } });

        dialogRef.onClose.subscribe((result) => {
            if (result.event === DialogAction.ADD) {
                this.store.dispatch(postUser({ user: result.data }));
            } else if (result.event === DialogAction.UPDATE) {
                this.store.dispatch(updateUser({ user: result.data }));
            }
        });
    }

    resetSearch() {
        this.searchText = '';
        this.doFilter('');
    }
}
