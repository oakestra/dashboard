import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { IOrganization } from '../../../root/interfaces/organization';
import { appReducer, getAllUser, postOrganization, updateOrganization } from '../../../root/store';
import { AddMemberComponent } from '../dialogs/add-member/add-member.component';
import { DialogAction } from '../../../root/enums/dialogAction';

@Component({
    selector: 'app-edit-organization',
    templateUrl: './edit-organization.component.html',
    styleUrls: ['./edit-organization.component.css'],
})
export class EditOrganizationComponent implements OnInit {
    @Input() organizations$: Observable<IOrganization[]>;
    @Input() selected: IOrganization;
    @Output() back = new EventEmitter<void>();
    name: string;
    member: string[];
    searchText = '';
    searchedMember: string[];

    constructor(private store: Store<appReducer.AppState>, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.store.dispatch(getAllUser());
        this.setValues();

        if (!this.selected._id) {
            const n = this.selected.name;
            this.organizations$.subscribe((organizations) => {
                this.selected = organizations.find((o) => o.name === n) ?? this.selected;
            });
        }
    }

    setValues() {
        this.searchedMember = this.selected?.member;
        this.name = this.selected.name;
        this.member = [...this.selected.member];
    }

    changeSelected(organization: IOrganization) {
        this.selected = organization;
        this.setValues();
    }

    addOrganizationEntry() {
        const organization: IOrganization = {
            name: 'New Organization',
            member: [],
        };
        this.selected = organization;
        this.store.dispatch(postOrganization({ organization }));
    }

    addMember() {
        const dialogRef = this.dialog.open(AddMemberComponent, { data: { currentMember: this.member } });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === DialogAction.ADD) {
                this.member = this.member.concat(result.data);
                this.search(this.searchText);
                this.save();
            }
        });
    }

    save() {
        const organization = {
            ...this.selected,
            name: this.name,
            member: this.member,
        };
        this.selected = organization;
        this.store.dispatch(updateOrganization({ organization }));
    }

    resetSearch() {
        this.searchText = '';
        this.search('');
    }

    search(event: any) {
        this.searchedMember = this.member.filter((m) => m.toLowerCase().indexOf(event.toLowerCase()) !== -1);
    }

    remove(member: string) {
        this.member = this.member.filter((m) => m !== member);
        this.search(this.searchText);
        this.save();
    }
}
