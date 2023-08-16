import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ApplicationEffects, appReducer, OrganizationEffects, SettingsEffects } from 'src/app/root/store/index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
    NbDatepickerModule,
    NbDialogModule,
    NbMenuModule,
    NbSidebarModule,
    NbThemeModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/sheard.module';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { UserEffects } from './root/store';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        // ControlModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        RouterModule.forRoot(routes),
        MatSnackBarModule,
        MatIconModule,
        StoreDevtoolsModule,
        StoreModule.forRoot(appReducer.reducers, {}),
        EffectsModule.forRoot([UserEffects, ApplicationEffects, SettingsEffects, OrganizationEffects]),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        NbThemeModule.forRoot(),
        NbEvaIconsModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
    ],
    providers: [
        // should be empty as we import all global services through "SharedModule.forRoot()"
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
