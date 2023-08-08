import { Component, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    template: ' <div class="content light"><router-outlet></router-outlet></div>',
    styles: ['.content{ width: 100vw;  height: 100vh;}'],
})
export class AppComponent {
    constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
        const darkMode = localStorage.getItem('darkMode');
        const isDarkMode = darkMode ? JSON.parse(darkMode) : false;
        const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
        this.renderer.setAttribute(this.document.body, 'class', hostClass);
    }
}
