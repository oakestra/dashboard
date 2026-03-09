import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { IOrganization, RoleEntry } from '../../../root/interfaces/organization';
import { appReducer, getAllUser, getOrganization, updateOrganization } from '../../../root/store';
import { AddMemberComponent } from '../dialogs/add-member/add-member.component';
import { DialogAction } from '../../../root/enums/dialogAction';
import { IUser } from '../../../root/interfaces/user';
import { selectAllUser } from '../../../root/store/selectors/user.selector';

@Component({
    selector: 'app-edit-organization',
    templateUrl: './edit-organization.component.html',
    styleUrls: ['./edit-organization.component.scss'],
})
export class EditOrganizationComponent implements OnInit {
    @Input() organizations$: Observable<IOrganization[]>;
    @Input() selected: IOrganization;
    @Output() back = new EventEmitter<void>();
    name: string;
    member: IUser[] = [];
    searchText = '';
    searchedMember: IUser[] = [];

    user$: Observable<IUser[]> = this.store.pipe(select(selectAllUser));
    user: IUser[];

    constructor(private store: Store<appReducer.AppState>, public dialog: NbDialogService) {}

    ngOnInit(): void {
        this.store.dispatch(getAllUser({ organization_id: '' }));
        this.user$.subscribe((user) => {
            this.user = user;
            this.getMemberNames();
        });
        this.name = this.selected.name;

        this.organizations$.subscribe((organizations) => {
            if (!this.selected) {
                return;
            }
            const selectedId = this.selected._id;
            const selectedName = this.selected.name;
            const refreshed = organizations.find((o) => (selectedId ? o._id === selectedId : o.name === selectedName));
            if (refreshed) {
                this.selected = refreshed;
                this.name = refreshed.name;
                this.getMemberNames();
            }
        });
    }

    private getMemberNames() {
        if (!this.selected || !this.user) {
            return;
        }
        const mem: IUser[] = [];
        const user_ids = this.selected.member.map((entry) => entry.user_id);
        this.member = this.user.filter((u) => user_ids.includes(u._id));

        this.member.forEach((m) => {
            const roleEntry = this.selected.member.find((s) => s.user_id === m._id);
            mem.push({
                ...m,
                roles: roleEntry.roles,
            });
        });
        this.member = [...mem];
        this.searchedMember = [...this.member];
    }

    changeSelected(organization: IOrganization) {
        this.selected = organization;
        this.name = organization.name;
        this.getMemberNames();
    }

    addMember() {
        const dialogRef = this.dialog.open(AddMemberComponent, { context: { data: { currentMember: this.member } } });

        dialogRef.onClose.subscribe((result) => {
            if (!result) {
                return;
            }
            const member = [...this.selected.member];
            if (result.event === DialogAction.ADD) {
                const user = result.data;
                user.forEach((u: IUser) => {
                    const entry: RoleEntry = {
                        user_id: u._id,
                        roles: [] as any[],
                    };
                    member.push(entry);
                });
                const organization: IOrganization = {
                    ...this.selected,
                    member,
                };
                this.selected = organization;
                this.getMemberNames();
                // TODO avoid two dispatch and update the organization in the first dispatch (with the answer of the api)
                this.store.dispatch(updateOrganization({ organization }));
                this.store.dispatch(getOrganization());
                this.search(this.searchText);
            }
        });
    }

    save() {
        const organization = {
            ...this.selected,
            name: this.name,
        };
        this.selected = organization;
        this.store.dispatch(updateOrganization({ organization }));
    }

    updateOrganization(user: IUser) {
        const newRoleEntry: RoleEntry = {
            user_id: user._id,
            roles: user.roles,
        };
        const member = this.selected.member.filter((m) => m.user_id !== user._id);
        const organization: IOrganization = {
            ...this.selected,
            member: [...member, newRoleEntry],
        };
        this.selected = organization;
        this.getMemberNames();
        this.search(this.searchText);
        this.store.dispatch(updateOrganization({ organization }));
    }

    resetSearch() {
        this.searchText = '';
        this.search('');
    }

    search(event: any) {
        this.searchedMember = this.member.filter(
            (m) => m.name.toLowerCase().indexOf(event?.toLowerCase() ?? '') !== -1,
        );
    }

    remove(member: IUser) {
        const newOrga = {
            ...this.selected,
            member: this.selected.member.filter((u) => u.user_id !== member._id),
        };
        this.selected = newOrga;
        this.getMemberNames();
        this.store.dispatch(updateOrganization({ organization: newOrga }));
        this.store.dispatch(getOrganization());
        this.search(this.searchText);
    }
}
