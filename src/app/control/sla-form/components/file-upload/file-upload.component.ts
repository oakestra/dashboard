import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';
import { ParsedSlaResult, SlaParserService } from '../../../../shared/modules/helper/sla-parser.service';
import { NotificationService } from '../../../../shared/modules/notification/notification.service';
import { NotificationType } from '../../../../root/interfaces/notification';

@Component({
    selector: 'form-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent extends SubComponent {
    @Output() upload = new EventEmitter<ParsedSlaResult>();
    @Input() service: IService;
    @Input() applicationName: string;

    jsonContent = '';
    filename = 'Select File to Upload';

    sampleService: any = {
        sla_version: 'v2.0',
        applications: [
            {
                application_name: 'myapp',
                microservices: [{ microservice_name: 'name', '...': '...' }],
            },
        ],
    };

    constructor(
        private slaParser: SlaParserService,
        private notifyService: NotificationService,
    ) {
        super();
        this.jsonContent = JSON.stringify(this.sampleService, null, 4);
    }

    loadFile(event: any) {
        const file = event.target.files[0] as File;
        console.log(file);
        if (file) {
            this.filename = file.name;
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.jsonContent = (fileReader.result ?? '').toString();
            };
            fileReader.readAsText(file);
        }
    }

    uploadDocument() {
        try {
            const rawJson = JSON.parse(this.jsonContent);
            const result = this.slaParser.parse(rawJson, this.applicationName);
            console.log(result);
            this.upload.emit(result);
        } catch (error) {
            console.error(error);
            this.notifyService.notify(NotificationType.error, (error as any).message || 'Error parsing SLA content');
        }
    }

    getData(): any {
        return '';
    }
}
