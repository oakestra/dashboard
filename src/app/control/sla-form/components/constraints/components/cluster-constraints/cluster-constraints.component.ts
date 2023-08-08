import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
// import * as uuid from 'uuid';
import { ApiService } from '../../../../../../shared/modules/api/api.service';

@Component({
    selector: 'app-cluster-constraints',
    templateUrl: './cluster-constraints.component.html',
    styleUrls: ['./cluster-constraints.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ClusterConstraintsComponent implements OnInit {
    parentForm!: FormGroup;
    formGroupName: string;

    clusterOptions: string[] = [];

    constructor(private fb: FormBuilder, private parent: FormGroupDirective, private apiService: ApiService) {
        this.formGroupName = 'direct_';
        // this.formGroupName = 'direct_' + uuid.v4(); // TODO
    }

    ngOnInit(): void {
        this.apiService.getClusters().subscribe((x) => {
            console.log(x);
            this.clusterOptions = x.map((cluster: any) => cluster.cluster_name);
            console.log(this.clusterOptions);
        });

        this.parentForm = this.parent.form;
        this.parentForm.addControl(
            this.formGroupName,
            this.fb.group({
                node: [''],
                cluster: [],
            }),
        );
    }
}
