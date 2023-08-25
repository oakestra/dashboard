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

        if (!this.selected._id) {
            const n = this.selected.name;
            this.organizations$.subscribe((organizations) => {
                this.selected = organizations.find((o) => o.name === n) ?? this.selected;
            });
        }
    }

    private getMemberNames() {
        const mem: IUser[] = [];
        const user_ids = this.selected.member.map((entry) => entry.user_id);
        this.member = this.user.filter((u) => user_ids.includes(u._id.$oid));

        this.member.forEach((m) => {
            const roleEntry = this.selected.member.find((s) => s.user_id === m._id.$oid);
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
        this.name = this.selected.name;
        this.getMemberNames();
    }

    addMember() {
        const dialogRef = this.dialog.open(AddMemberComponent, { context: { data: { currentMember: this.member } } });

        dialogRef.onClose.subscribe((result) => {
            const member = [...this.selected.member];
            if (result.event === DialogAction.ADD) {
                const user = result.data;
                user.forEach((u: IUser) => {
                    const entry: RoleEntry = {
                        user_id: u._id.$oid,
                        roles: [] as any[],
                    };
                    member.push(entry);
                });
                const organization: IOrganization = {
                    ...this.selected,
                    member,
                };
                this.selected = organization;
                // TODO avoid two dispatch
                this.store.dispatch(updateOrganization({ organization }));
                this.store.dispatch(getOrganization());
                this.search('');
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
            user_id: user._id.$oid,
            roles: user.roles,
        };
        const member = this.selected.member.filter((m) => m.user_id !== user._id.$oid);
        const organization: IOrganization = {
            ...this.selected,
            member: [...member, newRoleEntry],
        };
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
            member: this.selected.member.filter((u) => u.user_id !== member._id.$oid),
        };
        this.store.dispatch(updateOrganization({ organization: newOrga }));
        this.store.dispatch(getOrganization());
        this.member = this.member.filter((m) => m !== member);
        this.search(this.searchText);
    }
}
