import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { IOrganization } from '../../../root/interfaces/organization';
import { selectOrganization } from '../../../root/store/selectors/organization.selector';
import { appReducer, deleteOrganization, postOrganization } from '../../../root/store';
import { DialogConfirmationView } from '../../../root/components/dialogs/confirmation/dialogConfirmation';

@Component({
    selector: 'app-list-organization',
    templateUrl: './list-organization.component.html',
    styleUrls: ['./list-organization.component.scss'],
})
export class ListOrganizationComponent implements OnInit {
    @Output() selectedOrga = new EventEmitter<IOrganization>();

    public organizations$: Observable<IOrganization[]> = this.store.pipe(select(selectOrganization));
    displayedColumns: string[] = ['name', 'roles', 'symbol'];
    searchedOrganizations: Array<IOrganization> = [];
    searchText = '';

    allOrganizations: Array<IOrganization> = [];

    constructor(
        private dialog: NbDialogService,
        private store: Store<appReducer.AppState>,
    ) {}

    ngOnInit() {
        // Subscribe ONCE to keep the raw list updated
        this.organizations$.subscribe((o) => {
            this.allOrganizations = o;
            this.searchedOrganizations = this.allOrganizations.filter((org) =>
                this.nameFilter(org, this.searchText)
            );
        });
    }

    search(event: any): void {
        this.searchText = event;
        this.searchedOrganizations = this.allOrganizations.filter((org) =>
            this.nameFilter(org, this.searchText)
        );
    }

    nameFilter(organization: IOrganization, searchText: string): boolean {
        return (
            !searchText ||
            searchText.length === 0 ||
            organization.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
    }

    editOrganization(organization: IOrganization) {
        this.selectedOrga.emit(organization);
    }

    newOrganization() {
        const organization: IOrganization = {
            name: 'newOrganization',
            member: [],
        };
        this.store.dispatch(postOrganization({ organization }));
    }

    openDeleteDialog(organization: IOrganization) {
        const data = {
            text: 'Delete organization: ' + organization.name,
            type: 'organization',
        };
        const dialogRef = this.dialog.open(DialogConfirmationView, { context: { data } });
        dialogRef.onClose.subscribe((result) => {
            console.log(result);
            if (result?.event === true) {
                this.store.dispatch(deleteOrganization({ organization }));
            }
        });
    }
}
