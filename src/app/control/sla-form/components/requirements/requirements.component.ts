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
    target_node?: string;
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
            memory: [this.service?.memory ?? 50],
            vcpus: [this.service?.vcpus ?? 1],
            vgpus: [this.service?.vgpus ?? 0],
            vtpus: [this.service?.vtpus ?? 0],
            bandwidth_in: [this.service?.bandwidth_in ?? 0],
            bandwidth_out: [this.service?.bandwidth_out ?? 0],
            storage: [this.service?.storage ?? 0],
            port: [this.service?.port ?? ''],
            target_node: [this.service?.target_node ?? ''],
            sla_violation_strategy: [this.service?.sla_violation_strategy ?? ''],
        });

        this.form.patchValue(this.requirements);
    }

    getData(): requirementsType {
        return this.form.value;
    }
}
