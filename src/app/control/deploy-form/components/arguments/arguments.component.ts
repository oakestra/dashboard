import { Component } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-arguments',
    templateUrl: './arguments.component.html',
    styleUrls: ['./arguments.component.css'],
})
export class ArgumentsComponent extends SubComponent {
    // TODO Add add button and then create a array with multiple arguments
    argsText = '';

    getData(): any {
        return '';
    }
}
