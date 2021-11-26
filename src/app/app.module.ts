import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./shared/sheard.module";
import {routes} from "./app.routes";

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
  ],
  providers: [
    // should be empty as we import all global services through "SharedModule.forRoot()"
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
