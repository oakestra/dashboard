import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { NbMenuService } from '@nebular/theme';
import { IConstraints, IService } from '../../../../root/interfaces/service';
import { SubComponent } from '../../../../root/classes/subComponent';
import { ApiService } from '../../../../shared/modules/api/api.service';
import { ConstraintType } from '../../../../root/enums/constraint';

@Component({
    selector: 'form-constraints',
    templateUrl: './constraints.component.html',
    styleUrls: ['./constraints.component.scss'],
})
export class ConstraintsComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    constraintsForm: FormGroup;
    constraints: IConstraints[] = [];
    constraintsType: string[] = [];

    node: string[] = [];
    cluster: string[] = [];
    items = [{ title: 'Latency Constraints' }, { title: 'Geo Constraints' }, { title: 'Cluster Constraints' }];

    constructor(
        private nbMenuService: NbMenuService,
        private apiService: ApiService,
        private formBuilder: FormBuilder,
    ) {
        super();
        this.constraintsForm = new FormGroup({});
    }

    ngOnInit() {
        this.nbMenuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === 'constraints-menu'),
                map(({ item: { title } }) => title),
            )
            .subscribe((title) => {
                switch (title) {
                    case 'Latency Constraints': {
                        this.addConstrains(ConstraintType.LATENCY);
                        break;
                    }
                    case 'Geo Constraints': {
                        this.addConstrains(ConstraintType.GEO);
                        break;
                    }
                    case 'Cluster Constraints': {
                        this.addConstrains(ConstraintType.DIRECT);
                        break;
                    }
                    default: {
                        console.log('No event for this tag');
                    }
                }
            });
    }

    addConstrains(type: ConstraintType) {
        const con: IConstraints = {
            area: '',
            cluster: '',
            convergence_time: 0,
            location: '',
            node: '',
            rigidness: 0,
            threshold: 0,
            type,
        };

        this.constraintsType.push(type);
        this.constraints.push(con);

        console.log(this.constraintsForm);
    }

    isConstraintType(type: string, index: number): boolean {
        return this.constraintsType[index] === type;
    }

    // TODO test this very good, or find a better solution
    deleteConstraint(index: number) {
        this.constraints.splice(index, 1);
        this.constraintsType.splice(index, 1);
        const controlName = Object.keys(this.constraintsForm.getRawValue())[index];
        this.constraintsForm.removeControl(controlName);
    }

    headlineHelper(type: ConstraintType) {
        const typeName = type.toLowerCase();
        return typeName.charAt(0).toUpperCase() + typeName.slice(1);
    }

    private getConstraintsName(name: string): string {
        if (name.startsWith('direct') || name.startsWith('geo') || name.startsWith('latency')) {
            return name.split('_')[0];
        }
        return null;
    }

    getData() {
        const result = [];
        const constrains = this.constraintsForm.getRawValue();

        for (const k in constrains) {
            console.log(k);
            console.log(constrains[k]);
            const name = this.getConstraintsName(k);
            if (name) {
                result.push({
                    type: name,
                    ...constrains[k],
                });
            }
        }

        return {
            constraints: result,
        };
    }

    protected readonly ConstraintType = ConstraintType;
}
