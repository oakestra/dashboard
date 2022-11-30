import { Component } from '@angular/core';
import { Router } from '@angular/router';

// TODO Implement all missing stuff, are there the Endpoints for the registration?

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
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
