import {Component} from '@angular/core';
import {ShepherdService} from "angular-shepherd";
import {Router} from "@angular/router";


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent {

  defaultStepOptions: any
  productSteps: any
  builtInButtons: any
  lastButtons: any

  constructor(private shepherdService: ShepherdService,
              private router: Router) {

    this.builtInButtons = [
      {
        action(): any {
          return shepherdService.back()
        },
        text: 'BACK'
      },
      {
        action(): any {
          return shepherdService.next()
        },
        text: 'NEXT',
        classes: '',
      }
    ];

    this.lastButtons = [
      {
        action(): any {
          return shepherdService.back()
        },
        text: 'BACK'
      },
      {
        action(): any {
          router.navigate(["/control/survey"])
          return shepherdService.next()
        },
        text: 'NEXT',
        classes: '',
      }
    ];


    this.defaultStepOptions = {
      classes: 'shepherd-theme-arrows',
      scrollTo: true,
      cancelIcon: {
        enabled: true
      },
      tippyOptions: {
        duration: 500
      }

    };

    this.productSteps = [
      {
        attachTo: {
          element: '#homeNavbar',
          on: 'right'
        },
        buttons: [
          ...this.builtInButtons
        ],
        title: '1/5 Home',
        text: 'With this button you can always return to the main dashboard.'
      },
      {
        attachTo: {
          element: '#applicationTitle',
          on: 'right'
        },
        buttons:
        this.builtInButtons
        ,
        title: '2/5 Application',
        text: 'Your applications are displayed here. You can select or edit applications and create new ones. '
      },
      {
        attachTo: {
          element: '#content',
          on: 'top'
        },
        buttons: this.builtInButtons,
        title: '3/5 Services',
        text: 'The services of the selected application are displayed here.'
      },
      {
        attachTo: {
          element: '#createService',
          on: 'bottom'
        },
        buttons:
        this.builtInButtons
        ,
        title: '4/5 Create new service',
        text: 'Here you can create a new service that will be created in the selected application.'
      },
      {
        attachTo: {
          element: '#userSetting',
          on: 'bottom'
        },
        buttons:
        this.lastButtons
        ,
        title: '5/5 User settings',
        text: 'Here you can find all user related settings.'
      },
    ];
  }

  start() {
    this.router.navigate(["/control"])

    this.shepherdService.defaultStepOptions = this.defaultStepOptions;
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = true;
    this.shepherdService.addSteps(this.productSteps)
    this.shepherdService.start();

  }
}
