import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
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
import { HelpComponent } from './help/help.component';
import { DialogGenerateTokenView } from './navbar/dialogs/generate-token/dialogGenerateToken';
import { GraphComponent } from './service-dashboard/graph/graph.component';
import { DialogAddClusterView } from './navbar/dialogs/add-cluster/dialogAddCluster';
import { DialogAddApplicationView } from './application-dashboard/dialogs/add-appllication/dialogAddApplication';
import { DialogGraphConnectionView } from './service-dashboard/dialogs/graph-content-connection/dialog-graph-connection-view.component';
import { DialogConnectionSettingsView } from './sla-form/components/dialogs/content-connection/dialog-connection-settings-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServiceDashboardComponent } from './service-dashboard/service-dashboard.component';
import { SlaFormComponent } from './sla-form/sla-form.component';
import { routes } from './control.routing';
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
import { ApplicationsComponent } from './application-dashboard/applications.component';
import { FaqComponent } from './faq/faq.component';
import { ServiceItemComponent } from './service-dashboard/components/service-item/service-item.component';
import { InstanceDetailComponent } from './service-dashboard/components/instance-detail/instance-detail.component';
import { ChartCpuLineComponent } from './service-dashboard/components/instance-detail/chart-cpu-line.component';
import { ChartMemoryLineComponent } from './service-dashboard/components/instance-detail/chart-memory-line.component';

@NgModule({
    declarations: [
        SlaFormComponent,
        ServiceDashboardComponent,
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
        HelpComponent,
        DialogConfirmationView,
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
        ServiceItemComponent,
        InstanceDetailComponent,
        ChartCpuLineComponent,
        ChartMemoryLineComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTableModule,
        StoreModule.forFeature(fromService.serviceFeatureKey, fromService.reducer),
        EffectsModule.forFeature([ServiceEffects]),
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
