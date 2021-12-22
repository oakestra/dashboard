import {NgModule} from '@angular/core';
import {routes} from "./control.routing";
import {CommonModule} from '@angular/common';
import {DeployFormComponent} from "./deploy-form/deploy-form.component";
import {DevHomeComponent} from "./dev-home/dev-home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {DialogConnectionSettings} from "./dialogs/content-connection/dialogConnectionSettings";
import {DialogGraphConnectionSettings} from "./dialogs/graph-content-connection/dialogGraphConnectionSettings";
import {HelpComponent} from "./help/help.component";
import {DialogAddApplicationView} from "./dialogs/add-appllication/dialogAddApplication";
import {GraphComponent} from "./graph/graph.component";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {UsersComponent} from "./users/users.component";
import {MatChipsModule} from "@angular/material/chips";
import {DialogEditUserView} from "./dialogs/edit-user/dialogEditUser";
import {UserEditComponent} from './users/user-edit/user-edit.component';
import {DialogChangePasswordView} from "./dialogs/change-password/dialogChangePassword";


@NgModule({
  declarations: [
    DeployFormComponent,
    DevHomeComponent,
    NotFoundComponent,
    NavbarComponent,
    DialogConnectionSettings,
    DialogGraphConnectionSettings,
    HelpComponent,
    DialogAddApplicationView,
    GraphComponent,
    UsersComponent,
    DialogEditUserView,
    UserEditComponent,
    DialogChangePasswordView
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

  ],
})
export class ControlModule {
}
