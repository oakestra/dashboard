import { Component } from '@angular/core';
import { Router } from '@angular/router';

/*
TODO: Currently not needed. Discuss on Github if functionality is wanted. There are no Endpoints for the registration
 */

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    constructor(private router: Router) {}

    public submitRegister() {
        return;
    }

    loginForm() {
        void this.router.navigate(['']);
    }
}
