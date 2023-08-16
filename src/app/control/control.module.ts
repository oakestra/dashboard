import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
    NbAccordionModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDialogModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbRadioModule,
    NbSelectModule,
    NbSidebarModule,
    NbTabsetModule,
    NbTagModule,
    NbThemeModule,
    NbTooltipModule,
} from '@nebular/theme';
import * as fromService from '../root/store/reducers/service.reducer';
import { ServiceEffects } from '../root/store';
import { DialogConfirmationView } from '../root/components/dialogs/confirmation/dialogConfirmation';
import { ThemeModule } from '../@theme/theme.module';
import { UsersComponent } from './users/users.component';
import { DialogEditUserView } from './users/dialogs/edit-user/dialogEditUser';
import { ProfileComponent } from './profile/profile.component';
import { DialogChangePasswordView } from './profile/dialogs/change-password/dialogChangePassword';
import { DialogServiceStatusView } from './dev-home/dialogs/service-status/dialogServiceStatus';
import { ChartsComponent } from './dev-home/charts/charts.component';
import { HelpComponent } from './help/help.component';
import { DialogGenerateTokenView } from './navbar/dialogs/generate-token/dialogGenerateToken';
import { GraphComponent } from './dev-home/graph/graph.component';
import { DialogAddClusterView } from './navbar/dialogs/add-cluster/dialogAddCluster';
import { DialogAddApplicationView } from './navbar/dialogs/add-appllication/dialogAddApplication';
import { DialogGraphConnectionView } from './dev-home/dialogs/graph-content-connection/dialog-graph-connection-view.component';
import { DialogConnectionSettingsView } from './sla-form/components/dialogs/content-connection/dialog-connection-settings-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DevHomeComponent } from './dev-home/dev-home.component';
import { SlaFormComponent } from './sla-form/sla-form.component';
import { routes } from './control.routing';
import { AppListComponent } from './navbar/app-list/app-list.component';
import { ClusterListComponent } from './navbar/cluster-list/cluster-list.component';
import { ClusterComponent } from './cluster/cluster.component';
import { ConnectivityComponent } from './sla-form/components/connectivity/connectivity.component';
import { ConstraintsComponent } from './sla-form/components/constraints/constraints.component';
import { FileSelectComponent } from './sla-form/components/file-select/file-select.component';
import { FileUploadComponent } from './sla-form/components/file-upload/file-upload.component';
import { ServiceInfoComponent } from './sla-form/components/service-info/service-info.component';
import { RequirementsComponent } from './sla-form/components/requirements/requirements.component';
import { AddressesComponent } from './sla-form/components/addresses/addresses.component';
import { ArgumentsComponent } from './sla-form/components/arguments/arguments.component';
import { InfrastructureComponent } from './infrastructure/infrastructure.component';
import { OrganizationComponent } from './organization/organization.component';
import { EditOrganizationComponent } from './organization/edit-organization/edit-organization.component';
import { ListOrganizationComponent } from './organization/list-organization/list-organization.component';
import { AddMemberComponent } from './organization/dialogs/add-member/add-member.component';
import { MemberItemComponent } from './organization/edit-organization/member-item/member-item.component';
import { SettingsComponent } from './settings/settings.component';
import { LatencyConstraintsComponent } from './sla-form/components/constraints/components/long-lat-constraints/latency-constraints.component';
import { GeoConstraintsComponent } from './sla-form/components/constraints/components/geo-constraints/geo-constraints.component';
import { ClusterConstraintsComponent } from './sla-form/components/constraints/components/cluster-constraints/cluster-constraints.component';
import { ApplicationsComponent } from './applications/applications.component';
import { FaqComponent } from './faq/faq.component';

@NgModule({
    declarations: [
        SlaFormComponent,
        DevHomeComponent,
        NotFoundComponent,
        NavbarComponent,
        DialogConnectionSettingsView,
        DialogGraphConnectionView,
        DialogAddApplicationView,
        DialogAddClusterView,
        DialogGenerateTokenView,
        GraphComponent,
        UsersComponent,
        DialogEditUserView,
        ProfileComponent,
        DialogChangePasswordView,
        DialogServiceStatusView,
        ChartsComponent,
        HelpComponent,
        DialogConfirmationView,
        AppListComponent,
        ClusterListComponent,
        ClusterComponent,
        ConnectivityComponent,
        ConstraintsComponent,
        FileSelectComponent,
        FileUploadComponent,
        ServiceInfoComponent,
        RequirementsComponent,
        AddressesComponent,
        ArgumentsComponent,
        InfrastructureComponent,
        OrganizationComponent,
        EditOrganizationComponent,
        ListOrganizationComponent,
        AddMemberComponent,
        MemberItemComponent,
        SettingsComponent,
        LatencyConstraintsComponent,
        GeoConstraintsComponent,
        ClusterConstraintsComponent,
        ApplicationsComponent,
        FaqComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        // Angular Material Modules
        MatMenuModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatGridListModule,
        MatToolbarModule,
        MatIconModule,
        MatTabsModule,
        MatInputModule,
        MatTooltipModule,
        MatExpansionModule,
        MatRadioModule,
        MatDialogModule,
        MatSelectModule,
        MatOptionModule,
        MatPaginatorModule,
        MatTableModule,
        MatChipsModule,
        MatListModule,
        StoreModule.forFeature(fromService.serviceFeatureKey, fromService.reducer),
        EffectsModule.forFeature([ServiceEffects]),
        MatLegacyChipsModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        NbCardModule,
        NbButtonModule,
        NbDialogModule.forRoot(),
        NbMenuModule,
        NbLayoutModule,
        NbSidebarModule,
        ThemeModule,
        NbListModule,
        NbInputModule,
        NbIconModule,
        NbFormFieldModule,
        // NbThemeModule.forRoot(),
        NbSelectModule,
        NbTagModule,
        NbDialogModule,
        NbCheckboxModule,
        NbTabsetModule,
        NbTooltipModule,
        NbAccordionModule,
        NbContextMenuModule,
        NbRadioModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ControlModule {}
