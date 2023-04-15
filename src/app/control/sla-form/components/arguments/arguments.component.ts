import { Component, Input, OnInit } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';

@Component({
    selector: 'form-arguments',
    templateUrl: './arguments.component.html',
    styleUrls: ['./arguments.component.scss'],
})
export class ArgumentsComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    argsArray: string[];
    environment: string[];
    cmdArray: string[];

    ngOnInit(): void {
        this.argsArray = this.service?.args ?? [];
        this.environment = this.service?.environment ?? [];
        this.cmdArray = this.service?.cmd ?? [];
    }

    addArgument() {
        this.argsArray.push('');
    }

    deleteArgument(index: number) {
        this.argsArray.splice(index, 1);
    }

    addEnvironment() {
        this.environment.push('');
    }

    deleteEnvironment(index: number) {
        this.environment.splice(index, 1);
    }

    addCmd() {
        this.cmdArray.push('');
    }

    deleteCmd(index: number) {
        this.cmdArray.splice(index, 1);
    }

    getData(): any {
        return {
            args: this.argsArray,
            environment: this.environment,
        };
    }

    trackByIdx(index: number): any {
        return index;
    }
}
