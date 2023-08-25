import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDialogModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbSidebarModule,
    NbThemeModule,
    NbTooltipModule,
} from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ThemeModule } from '../@theme/theme.module';
import * as fromService from '../root/store/reducers/service.reducer';
import { ServiceEffects } from '../root/store';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginComponent } from './components/login/login.component';
import { routes } from './login.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        StoreModule.forFeature(fromService.serviceFeatureKey, fromService.reducer),
        EffectsModule.forFeature([ServiceEffects]),
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
        NbTooltipModule,
        NbCheckboxModule,
        NbThemeModule.forRoot({ name: 'dark' }),
    ],
    declarations: [LoginComponent, ResetPasswordComponent],
    exports: [RouterModule],
    // bootstrap: [AppComponent],
})
export class LoginModule {}
