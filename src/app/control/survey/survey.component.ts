import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/modules/api/api.service';
import { SharedIDService } from '../../shared/modules/helper/shared-id.service';
import { IApplication } from '../../root/interfaces/application';
import { SurveyService } from './survey.service';
import { SurveyNotificationService } from './survey-notification.service';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css'],
})

// TODO Remove Survey Component
export class SurveyComponent implements OnInit {
    selected = '0';
    evaluated = false;
    correctTasks = 0;
    taskResults = [false, false, false, false, false];
    myapp: IApplication;

    constructor(
        public surveyService: SurveyService,
        private api: ApiService,
        public sharedService: SharedIDService,
        private surveyNotification: SurveyNotificationService,
    ) {}

    ngOnInit(): void {
        this.selected = localStorage.getItem('location') ?? '';
        this.evaluated = this.surveyService.evaluated;
        this.correctTasks = this.surveyService.correctTasks;
        this.taskResults = this.surveyService.taskResults;
    }

    step = -1;

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    locationChange() {
        localStorage.setItem('location', this.selected);
    }

    pinTask(taskNumber: number) {
        this.surveyNotification.notify(taskNumber);
    }

    evaluateTasks() {
        this.correctTasks = 0;
        this.taskResults = [false, false, false, false, false];

        // Evaluation of the first task
        this.api.getApplicationsOfUser(this.sharedService.userID).subscribe((result: any) => {
            for (const a of result) {
                if ((a.name === 'MyApplication' && a.namespace === 'survey') || a.description === 'survey task') {
                    this.taskResults[0] = true;
                    this.myapp = a;
                    this.correctTasks++;
                }
            }
            this.evaluateNextTask(this.myapp);
        });

        // Evaluation of the second task
        if (localStorage.getItem('location') === '3') {
            this.taskResults[1] = true;
            this.correctTasks++;
        }

        // Evaluation of the third task
        this.api.getAllUser().subscribe((users: any) => {
            this.taskResults[2] = true;
            this.correctTasks++;
            for (const u of users) {
                if (u.name === 'Evil-user') {
                    this.taskResults[2] = false;
                    this.correctTasks--;
                }
            }
        });
    }

    evaluateNextTask(myapp: any) {
        // Evaluation of the fourth task
        let serviceA = false;
        let serviceB = false;
        let serviceAConnection: any;
        let targetId: string;

        if (myapp) {
            this.api.getServicesOfApplication(myapp._id.$oid).subscribe((services: any) => {
                for (const j of services) {
                    if (j.microservice_name === 'Service1') {
                        if (j.microservice_namespace === 'dev' && j.memory === 100) {
                            serviceA = true;
                        }

                        serviceAConnection = j.connectivity[0];
                    }
                    if (j.microservice_name === 'Service2') {
                        if (j.vcpus === 2) {
                            serviceB = true;
                        }
                        targetId = j.microserviceID;
                    }
                }
                if (serviceA && serviceB) {
                    this.correctTasks++;
                    this.taskResults[3] = true;
                }
                this.evaluateLastTask(serviceAConnection, targetId);
            });
        }

        this.evaluated = true;
    }

    evaluateLastTask(serviceAConnection: any, targetId: string) {
        // Evaluation of the fifth task
        if (serviceAConnection && serviceAConnection.target_microservice_id === targetId) {
            const con = serviceAConnection.con_constraints[0];
            if (
                con.type === 'latency'
                && con.threshold === 300
                && con.rigidness === 50
                && con.convergence_time === 250
            ) {
                this.taskResults[4] = true;
                this.correctTasks++;
            }
        }
        this.evaluated = true;
    }
}
