import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DataService} from "./shared/modules/api/data.service";
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
import {SharedIDService} from "./shared/modules/helper/shared-id.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {UserService} from "./shared/modules/auth/user.service";
import {AuthService} from "./shared/modules/auth/auth.service";
import {AuthGuardService} from "./shared/modules/auth/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
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

      {
        path: 'control',
        loadChildren: () => import('src/app/control/control.module').then(m => m.ControlModule),
        canActivate: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('src/app/landingpage/landingpage.module').then(m => m.LandingPageModule),
      },
      {path: '**', pathMatch: 'full', redirectTo: '/'}

    ]),
    MatMenuModule,
    MatProgressBarModule,
  ],
  providers: [
    DataService,
    SharedIDService,
    UserService,
    AuthService,
    AuthGuardService,
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
