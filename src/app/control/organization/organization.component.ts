import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { appReducer } from '../../root/store';
import { IOrganization } from '../../root/interfaces/organization';
import { selectOrganization } from '../../root/store/selectors/organization.selector';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
    public organizations$: Observable<IOrganization[]> = this.store.pipe(select(selectOrganization));
    public selected: IOrganization = null;
    public edit = true;

    constructor(private store: Store<appReducer.AppState>) {}

    editOrganization(organization: IOrganization) {
        this.selected = organization;
        this.toggleEdit();
    }

    toggleEdit() {
        this.edit = !this.edit;
    }
}
