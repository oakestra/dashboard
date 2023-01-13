import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationType } from '../../../../root/interfaces/notification';
import { ApiService } from '../../../../shared/modules/api/api.service';
import { NotificationService } from '../../../../shared/modules/notification/notification.service';
import { SubComponent } from '../../../../root/classes/subComponent';

@Component({
    selector: 'form-file-select',
    templateUrl: './file-select.component.html',
    styleUrls: ['./file-select.component.css'],
})
export class FileSelectComponent extends SubComponent {
    constructor(private api: ApiService, private notifyService: NotificationService) {
        super();
    }

    fileArrayForm: any[] = [];

    deleteFiles(index: number) {
        this.fileArrayForm.splice(index, 1);
    }

    addFileInput() {
        // TODO Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.fileArrayForm.push(new FormControl());
    }

    onFileSelected(event: any, index: number, action: string) {
        const file: File = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const path = this.api.fileUpload(formData);
            let fc;
            console.log(fc);
            path.subscribe({
                next: (x: any) => {
                    if (action === 'file') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        // TODO fix
                        this.fileArrayForm.controls[index] = new FormControl([x.path]);
                    } else if (action === 'code') {
                        // TODO
                        // fc = this.form.get('code') as FormControl;
                        // fc.setValue([x.path]);
                    } else if (action === 'state') {
                        // TODO
                        // fc = this.form.get('state') as FormControl;
                        // fc.setValue([x.path]);
                    }
                },
                error: () => {
                    this.notifyService.notify(NotificationType.error, 'File not supported');
                },
            });
        }
    }

    getData(): any {
        return '';
    }
}
