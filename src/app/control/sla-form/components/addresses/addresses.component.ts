import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IInstanceAddress, IService } from '../../../../root/interfaces/service';

@Component({
    selector: 'form-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.css'],
})
export class AddressesComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    form: FormGroup;
    instances: IInstanceAddress[] = [];

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            rr_ip: this.service?.addresses?.rr_ip ?? [''],
            closest_ip: this.service?.addresses?.closest_ip ?? [''],
        });

        this.instances.push({
            from: '',
            to: '',
            start: '',
        });

        if (this.service?.addresses?.instances?.length === 0) {
            this.instances = this.service.addresses.instances;
        }
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
