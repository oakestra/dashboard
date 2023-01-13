import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';

type serviceInfo = {
    microservice_name: string;
    microservice_namespace: string;
    virtualization: string;
    description: string;
};

@Component({
    selector: 'form-service-info',
    templateUrl: './service-info.component.html',
    styleUrls: ['./service-info.component.css'],
})
export class ServiceInfoComponent extends SubComponent implements OnInit {
    applicationId = 'to set';
    form: FormGroup;

    @Input() service: IService;

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            microservice_name: [this.service.microservice_name ?? '', Validators.required],
            microservice_namespace: [this.service.microservice_namespace ?? ''],
            virtualization: [this.service.virtualization ?? ''],
            description: [this.service.description ?? ''],
        });
    }

    getData(): serviceInfo {
        return this.form.value;
    }
}
