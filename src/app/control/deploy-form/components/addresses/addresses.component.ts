import { Component } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.css'],
})
export class AddressesComponent extends SubComponent {
    getData(): any {
        return '';
    }
}
