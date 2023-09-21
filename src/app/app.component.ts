import { AfterViewInit, Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-root',
    template: ' <div class="content light"><router-outlet></router-outlet></div>',
    styles: ['.content{ width: 100vw;  height: 100vh;}'],
})
export class AppComponent implements AfterViewInit {
    constructor(private themeService: NbThemeService, private cookieService: CookieService) {}

    ngAfterViewInit() {
        const cookieValue = this.cookieService.get('themeCookie');
        const themeOptions = ['default', 'dark', 'cosmic', 'corporate'];
        if (cookieValue) {
            const data = JSON.parse(cookieValue);
            if (themeOptions.includes(data.theme)) {
                this.themeService.changeTheme('dark');
            }
        } else {
            this.themeService.changeTheme('dark');
        }
    }
}
