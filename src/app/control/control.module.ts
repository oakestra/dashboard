import {NgModule} from '@angular/core';
import {routes} from "./control.routing";
import {CommonModule} from '@angular/common';
import {DeployFormComponent} from "./deploy-form/deploy-form.component";
import {DevHomeComponent} from "./dev-home/dev-home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {DialogConnectionSettings} from "./dialogs/dialogConnectionSettings";
import {DialogGraphConnectionSettings} from "./dialogs/dialogGraphConnectionSettings";
import {HelpComponent} from "./help/help.component";
import {DialogAddApplicationView} from "./dialogs/dialogAddApplication";
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
    //LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
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
  ],
})
export class ControlModule {
}
