import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
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
        
        const constraintsGroup = this.fb.group({
            node: [''],
            cluster: [],
        });

        this.parentForm.addControl(this.formGroupName, constraintsGroup);

        constraintsGroup.get('cluster')?.valueChanges.subscribe((selectedClusters: string[]) => {
            const nodeControl = constraintsGroup.get('node');

            if (Array.isArray(selectedClusters) && selectedClusters.length > 1) {
                nodeControl?.setValue('');    
                nodeControl?.disable();    
            } else {
                nodeControl?.enable();     
            }
        });

    }

    get showNodeWarning(): boolean {
        const clusters = this.parentForm.get(this.formGroupName)?.get('cluster')?.value;
        return Array.isArray(clusters) && clusters.length > 1;
    }
}