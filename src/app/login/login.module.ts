import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
        NbTooltipModule,
        NbCheckboxModule,
        NbThemeModule.forRoot({ name: 'dark' }),
    ],
    declarations: [LoginComponent, ResetPasswordComponent],
    exports: [RouterModule],
    // bootstrap: [AppComponent],
})
export class LoginModule {}
