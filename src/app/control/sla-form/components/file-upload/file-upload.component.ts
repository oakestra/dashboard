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

    file: File | undefined;
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
    }

    loadFile(event: any) {
        this.file = event.target.files[0] as File;
        console.log(this.file);
        this.filename = this.file.name;
    }

    uploadDocument() {
        if (this.file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                try {
                    const rawJson = JSON.parse((fileReader.result ?? '').toString());

                   
                    const result = this.slaParser.parse(rawJson, this.applicationName);

                    console.log(result);
                    this.upload.emit(result);
                } catch (error) {
                    console.error(error);
                    this.notifyService.notify(NotificationType.error, (error as any).message || 'Error parsing SLA file');
                }
            };
            fileReader.readAsText(this.file);
        }
    }

    getData(): any {
        return '';
    }
}
