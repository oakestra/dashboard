import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginComponent } from './components/login/login.component';
import { routes } from './login.routing';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        CommonModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
    providers: [],
    declarations: [LoginComponent, ResetPasswordComponent],
    exports: [RouterModule],
})
export class LoginModule {}
