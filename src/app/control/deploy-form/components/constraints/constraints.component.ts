import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConstraints } from '../../../../root/interfaces/service';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-constraints',
    templateUrl: './constraints.component.html',
    styleUrls: ['./constraints.component.css'],
})
export class ConstraintsComponent extends SubComponent {
    constraints: IConstraints[] = [];
    canViewLatConstrains: boolean[] = [];

    conConstrainsArray: FormArray[] = [
        new FormArray([
            new FormGroup({
                type: new FormControl(0),
                threshold: new FormControl(0),
                rigidness: new FormControl(0),
                convergence_time: new FormControl(0),
            }),
        ]),
    ];

    addConstrains(type: string) {
        const con: IConstraints = {
            area: '',
            cluster: '',
            convergence_time: 0,
            location: '',
            node: '',
            rigidness: 0,
            threshold: 0,
            type: 'latency',
        };
        if (type === 'geo') {
            con.type = 'geo';
        }
        this.constraints.push(con);
    }

    deleteConstrains(index: number) {
        this.constraints.splice(index, 1);
        this.canViewLatConstrains.splice(index, 1);
    }

    getData() {
        return {
            constraints: this.constraints,
        };
    }
}
