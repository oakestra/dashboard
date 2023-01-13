import { Component } from '@angular/core';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent extends SubComponent {
    file: File | undefined;
    filename = 'Select File to Upload';
    applicationId = '123'; // TODO

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
                sla.applicationID = this.applicationId;
                sla._id = null;
                if (sla.job_name) {
                    delete sla.job_name;
                }
                // TODO Creat a service for thees two functions
                // this.generateSLA(sla);
                // this.addService();
            };
            fileReader.readAsText(this.file);
        }
    }

    getData(): any {
        return '';
    }
}
