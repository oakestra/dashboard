import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IInstanceAddress } from '../../../../root/interfaces/service';

@Component({
    selector: 'form-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.css'],
})
export class AddressesComponent extends SubComponent implements OnInit {
    form: FormGroup;
    instances: IInstanceAddress[] = [];

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            rr_ip: [''],
            closest_ip: [],
        });

        this.instances.push({
            from: '',
            to: '',
            start: '',
        });
    }

    getData(): any {
        return {
            addresses: {
                ...this.form.value,
                instances: this.instances,
            },
        };
    }

    trackByIdx(index: number): any {
        return index;
    }
}
