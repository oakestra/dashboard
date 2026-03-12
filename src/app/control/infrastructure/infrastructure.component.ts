import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-infrastructure',
    templateUrl: './infrastructure.component.html',
    styleUrls: ['./infrastructure.component.scss'],
})
export class InfrastructureComponent {

    public grafanaApi: string = "";

    ngOnInit() {
        this.grafanaApi = environment.grafanaUrl;
        window.open(this.grafanaApi, "_blank");
        window.location.href = "/control";
    }

}
