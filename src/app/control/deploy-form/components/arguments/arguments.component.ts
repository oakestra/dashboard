import { Component, Input, OnInit } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';

@Component({
    selector: 'form-arguments',
    templateUrl: './arguments.component.html',
    styleUrls: ['./arguments.component.css'],
})
export class ArgumentsComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    argsArray: string[];

    ngOnInit(): void {
        this.argsArray = this.service?.args ?? [''];
    }

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
