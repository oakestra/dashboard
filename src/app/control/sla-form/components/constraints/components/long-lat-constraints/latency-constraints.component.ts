import { Component } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
// import * as uuid from 'uuid';
import { ApiService } from '../../../../../../shared/modules/api/api.service';

@Component({
    selector: 'app-latency-constraints',
    templateUrl: './latency-constraints.component.html',
    styleUrls: ['./latency-constraints.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class LatencyConstraintsComponent {
    parentForm!: FormGroup;
    formGroupName: string;

    constructor(private fb: FormBuilder, private parent: FormGroupDirective, private apiService: ApiService) {
        this.formGroupName = 'latency_';
        // this.formGroupName = 'latency_' + uuid.v4(); // TODO
    }

    ngOnInit(): void {
        this.parentForm = this.parent.form;
        this.parentForm.addControl(
            this.formGroupName,
            this.fb.group({
                area: [''],
                threshold: [''],
                rigidness: [''],
                convergence_time: [''],
            }),
        );
    }
}
