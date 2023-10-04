import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
// import * as uuid from 'uuid';

@Component({
    selector: 'app-geo-constraints',
    templateUrl: './geo-constraints.component.html',
    styleUrls: ['./geo-constraints.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class GeoConstraintsComponent implements OnInit {
    longitude = 0;
    latitude = 0;
    location = '';
    parentForm!: FormGroup;
    formGroupName: string;

    constructor(private fb: FormBuilder, private parent: FormGroupDirective) {
        this.formGroupName = 'geo_';
        // this.formGroupName = 'geo_' + uuid.v4(); // TODO
    }

    ngOnInit(): void {
        this.parentForm = this.parent.form;
        this.parentForm.addControl(
            this.formGroupName,
            this.fb.group({
                convergence_time: [0],
                rigidness: [0],
                threshold: [0],
                location: [''],
            }),
        );
    }

    updateLongLat(): void {
        this.location = `(${this.longitude},${this.latitude})`;
        console.log(this.location);
    }
}
