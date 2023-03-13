import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { IOrganization } from '../../../root/interfaces/organization';
import { appReducer, postOrganization } from '../../../root/store';
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
    searchText = '';
    searchedMember: string[];

    constructor(private store: Store<appReducer.AppState>, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.searchedMember = this.selected?.member;
    }

    changeSelected(o: IOrganization) {
        console.log(o);
        this.selected = o;
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
        const dialogRef = this.dialog.open(AddMemberComponent, {});

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === DialogAction.ADD) {
                console.log('ass');
            }
        });
    }

    resetSearch() {
        this.searchText = '';
        this.search('');
    }

    search(event: any) {
        console.log(event);
        console.log(this.searchText);
        this.searchedMember = this.selected.member.filter((m) => m.toLowerCase().indexOf(event.toLowerCase()) !== -1);
    }

    remove() {
        console.log('remove');
    }
}
