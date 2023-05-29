import { Component, Input } from '@angular/core';
import { IConstraints, IService } from '../../../../root/interfaces/service';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-constraints',
    templateUrl: './constraints.component.html',
    styleUrls: ['./constraints.component.scss'],
})
export class ConstraintsComponent extends SubComponent {
    @Input() service: IService;
    constraints: IConstraints[] = [];
    canViewLatConstrains: boolean[] = [];
    longitude: number[] = [];
    latitude: number[] = [];

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
        this.canViewLatConstrains.push(type !== 'geo');
        this.constraints.push(con);
        this.longitude.push(0);
        this.latitude.push(0);
    }

    deleteConstrains(index: number) {
        this.constraints.splice(index, 1);
        this.longitude.splice(index, 1);
        this.latitude.splice(index, 1);
        this.canViewLatConstrains.splice(index, 1);
    }

    updateLongLat(index: number): void {
        this.constraints[index].location = `(${this.longitude[index]},${this.latitude[index]})`;
        console.log(this.constraints);
    }

    getData() {
        return {
            constraints: this.constraints,
        };
    }
}
