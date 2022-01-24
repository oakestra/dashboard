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
        title: '1/4 Home',
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
        title: '2/4 Application',
        text: 'Your applications are displayed here. You can select or edit applications and create new ones. '
      },
      {
        attachTo: {
          element: '#content',
          on: 'right'
        },
        buttons: this.builtInButtons,
        title: '3/4 Jobs',
        text: 'The Jobs of the selected application are displayed here.'
      },
      {
        attachTo: {
          element: '#createJob',
          on: 'bottom'
        },
        buttons:
        this.builtInButtons
        ,
        title: '4/4 Create new Job',
        text: 'Here you can create a new job that will be created in the selected application.'
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
