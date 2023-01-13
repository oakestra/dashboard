import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubComponent } from '../../../../root/classes/subComponent';

type requirementsType = {
    memory?: number;
    vcpus?: number;
    vgpus?: number;
    vtpus?: number;
    bandwidth_in?: number;
    bandwidth_out?: number;
    storage?: number;
    port?: string;
};

@Component({
    selector: 'form-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.css'],
})
export class RequirementsComponent extends SubComponent implements OnInit {
    form: FormGroup;
    requirements: requirementsType = {};

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            memory: [50],
            vcpus: [1],
            vgpus: [0],
            vtpus: [0],
            bandwidth_in: [0],
            bandwidth_out: [0],
            storage: [0],
            port: [''],
        });

        this.form.patchValue(this.requirements);
    }

    getData(): requirementsType {
        return this.form.value;
    }
}
