import { Component } from '@angular/core';
// import { ShepherdService } from 'angular-shepherd'; TODO Angular shepherd does not work with angular v15, search for alternative
import { Router } from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css'],
})
export class HelpComponent {
    // defaultStepOptions;
    productSteps: any;
    // builtInButtons;
    // lastButtons;

    constructor(private router: Router) {
        /*
        this.builtInButtons = [
            {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                action() {
                    return shepherdService.back();
                },
                text: 'BACK',
            },
            {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                action() {
                    return shepherdService.next();
                },
                text: 'NEXT',
                classes: '',
            },
        ];

        this.lastButtons = [
            {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                action() {
                    return shepherdService.back();
                },
                text: 'BACK',
            },
            {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                action() {
                    void router.navigate(['/control/survey']).then();
                    return shepherdService.next();
                },
                text: 'NEXT',
                classes: '',
            },
        ];

        this.defaultStepOptions = {
            classes: 'shepherd-theme-arrows',
            scrollTo: true,
            cancelIcon: {
                enabled: true,
            },
            tippyOptions: {
                duration: 500,
            },
        };

        this.productSteps = [
            {
                attachTo: {
                    element: '#homeNavbar',
                    on: 'right',
                },
                buttons: [...this.builtInButtons],
                title: '1/5 Home',
                text: 'With this button you can always return to the main dashboard.',
            },
            {
                attachTo: {
                    element: '#applicationTitle',
                    on: 'right',
                },
                buttons: this.builtInButtons,
                title: '2/5 Application',
                text: 'Your applications are displayed here. You can select or edit applications and create new ones. ',
            },
            {
                attachTo: {
                    element: '#content',
                    on: 'top',
                },
                buttons: this.builtInButtons,
                title: '3/5 Services',
                text: 'The services of the selected application are displayed here.',
            },
            {
                attachTo: {
                    element: '#createService',
                    on: 'bottom',
                },
                buttons: this.builtInButtons,
                title: '4/5 Create new service',
                text: 'Here you can create a new service that will be created in the selected application.',
            },
            {
                attachTo: {
                    element: '#userSetting',
                    on: 'bottom',
                },
                buttons: this.lastButtons,
                title: '5/5 User settings',
                text: 'Here you can find all user related settings.',
            },
        ];

       */
    }

    start() {
        void this.router.navigate(['/control']).then();
        /*
        this.shepherdService.defaultStepOptions = this.defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = true;
        this.shepherdService.addSteps(this.productSteps);
        this.shepherdService.start();

        */
    }
}
