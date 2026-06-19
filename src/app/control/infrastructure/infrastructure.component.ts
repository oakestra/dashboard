import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
    standalone: false,
    selector: 'app-infrastructure',
    templateUrl: './infrastructure.component.html',
    styleUrls: ['./infrastructure.component.scss'],
})
export class InfrastructureComponent {

    public grafanaApi: string = '';

    ngOnInit() {
        const parts: string[] = environment.apiUrl.split(':');
        this.grafanaApi = 'http:' + parts[1] + ':3000' ;
        window.open(this.grafanaApi, '_blank');
        window.location.href = '/control';
    }

}
