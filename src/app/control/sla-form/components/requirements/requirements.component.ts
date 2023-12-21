import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';

type requirementsType = {
    memory?: number;
    vcpus?: number;
    vgpus?: number;
    vtpus?: number;
    bandwidth_in?: number;
    bandwidth_out?: number;
    storage?: number;
    port?: string;
    sla_violation_strategy?: string;
};

@Component({
    selector: 'form-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    form: FormGroup;
    requirements: requirementsType = {};

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            memory: [this.service?.memory],
            vcpus: [this.service?.vcpus],
            vgpus: [this.service?.vgpus],
            vtpus: [this.service?.vtpus],
            bandwidth_in: [this.service?.bandwidth_in],
            bandwidth_out: [this.service?.bandwidth_out],
            storage: [this.service?.storage],
            port: [this.service?.port ?? ''],
        });

        this.form.patchValue(this.requirements);
    }

    getData(): requirementsType {
        return this.form.value;
    }
}
