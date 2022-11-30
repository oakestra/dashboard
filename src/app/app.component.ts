import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: ' <div class="content"><router-outlet></router-outlet></div>',
    styles: ['.content{background-color: #3b474e;  width: 100vw;  height: 100vh;}'],
})
export class AppComponent {}
