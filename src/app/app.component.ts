import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <!--    TODO Notifications are implemented in a later step-->
    <!--    <simple-notifications [options]="notificationOptions"></simple-notifications>-->
  `
})

export class AppComponent {
}
