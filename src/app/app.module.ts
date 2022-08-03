import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./shared/sheard.module";
import {routes} from "./app.routes";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {AgmCoreModule} from '@agm/core';

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
    SharedModule.forRoot(),
    RouterModule.forRoot(routes),
    MatSnackBarModule,
    MatIconModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBYX8yJlDW4CJ2c-fQ3qENvrmIWIrUJWUA',
      libraries: ["places", "geometry"]
    })
  ],
  providers: [
    // should be empty as we import all global services through "SharedModule.forRoot()"
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
