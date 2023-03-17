import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { IOrganization } from '../../../root/interfaces/organization';
import { selectOrganization } from '../../../root/store/selectors/organization.selector';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { appReducer, deleteOrganization, postOrganization } from '../../../root/store';
import { DialogConfirmationView } from '../../dialogs/confirmation/dialogConfirmation';

@Component({
    selector: 'app-list-organization',
    templateUrl: './list-organization.component.html',
    styleUrls: ['./list-organization.component.css'],
})
export class ListOrganizationComponent implements OnInit {
    @Output() selectedOrga = new EventEmitter<IOrganization>();

    public organizations$: Observable<IOrganization[]> = this.store.pipe(select(selectOrganization));
    displayedColumns: string[] = ['name', 'roles', 'symbol'];
    searchedOrganizations: Array<IOrganization> = [];
    searchText = '';

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
        this.organizations$.subscribe((o) => {
            this.searchedOrganizations = o.filter((organization) => this.nameFilter(organization, ''));
        });
    }

    search(event: any): void {
        this.organizations$.subscribe((o) => {
            this.searchedOrganizations = o.filter((organization) => this.nameFilter(organization, event));
        });
    }

    nameFilter(organization: IOrganization, searchText: string): boolean {
        return (
            !searchText ||
            searchText.length === 0 ||
            organization.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
    }

    editOrganization(organization: IOrganization) {
        console.log('sub edit');
        console.log(organization);
        this.selectedOrga.emit(organization);
    }

    newOrganization() {
        const organization: IOrganization = {
            name: 'newOrganization',
            member: [],
        };
        this.store.dispatch(postOrganization({ organization }));
        this.editOrganization(organization);
    }

    openDeleteDialog(organization: IOrganization) {
        const data = {
            text: 'Delete organization: ' + organization.name,
            type: 'organization',
        };
        const dialogRef = this.dialog.open(DialogConfirmationView, { data });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result.event === true) {
                this.store.dispatch(deleteOrganization({ organization }));
            }
        });
    }
}
