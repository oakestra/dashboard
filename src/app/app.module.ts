import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppComponent} from './app.component';
import {DeployFormComponent} from './deploy-form/deploy-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {JobService} from "./services/job.service";
import {DevHomeComponent} from './dev-home/dev-home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NavbarComponent} from './navbar/navbar.component';
import {DataService} from "./services/data.service";
import {AppErrorHandler} from "./app-error-handler";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatRadioModule} from "@angular/material/radio";
import {MatDialogModule} from "@angular/material/dialog";
import {DialogConnectionSettings} from "./dialogs/dialogConnectionSettings";
import {HelpComponent} from './help/help.component';
import {DialogAddApplicationView} from "./dialogs/dialogAddApplication";
import {SharedIDService} from "./services/shared-id.service";

@NgModule({
  declarations: [
    AppComponent,
    DeployFormComponent,
    DevHomeComponent,
    NotFoundComponent,
    NavbarComponent,
    DialogConnectionSettings,
    HelpComponent,
    DialogAddApplicationView
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
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

    RouterModule.forRoot([
      {path: '', component: DevHomeComponent},
      {path: 'deploy', component: DeployFormComponent},
      {path: 'help', component: HelpComponent},
      {path: '**', component: NotFoundComponent}
    ]),
  ],
  providers: [
    JobService,
    DataService,
    SharedIDService,
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
