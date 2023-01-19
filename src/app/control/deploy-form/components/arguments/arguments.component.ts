import { Component } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-arguments',
    templateUrl: './arguments.component.html',
    styleUrls: ['./arguments.component.css'],
})
export class ArgumentsComponent extends SubComponent {
    // TODO Add add button and then create a array with multiple arguments
    argsArray: string[] = ['Test', 'Test2'];

    addArgument() {
        this.argsArray.push('');
    }

    deleteArgument(index: number) {
        this.argsArray.splice(index, 1);
    }

    getData(): any {
        return {
            args: this.argsArray,
        };
    }

    trackByIdx(index: number): any {
        return index;
    }
}
