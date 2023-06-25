import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';
import { IService } from '../../../../root/interfaces/service';

@Component({
    selector: 'form-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent extends SubComponent {
    @Output() upload = new EventEmitter<IService[]>();
    @Input() service: IService;
    file: File | undefined;
    filename = 'Select File to Upload';

    loadFile(event: any) {
        this.file = event.target.files[0] as File;
        console.log(this.file);
        this.filename = this.file.name;
    }

    uploadDocument() {
        if (this.file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const sla = JSON.parse((fileReader.result ?? '').toString());
                console.log(sla);
                this.upload.emit(sla.microservices as IService[]);
            };
            fileReader.readAsText(this.file);
        }
    }

    getData(): any {
        return '';
    }
}
