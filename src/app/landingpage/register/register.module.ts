import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RegisterComponent} from "./register.component";

@NgModule({
    imports: [
       // RouterModule.forChild(routes),
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        CommonModule,
        MatTooltipModule,
    ],
  providers: [],
  exports: [RouterModule],
})
export class RegisterModule {
}
