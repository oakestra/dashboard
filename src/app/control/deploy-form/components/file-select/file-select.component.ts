import { Component } from '@angular/core';
import { NotificationType } from '../../../../root/interfaces/notification';
import { ApiService } from '../../../../shared/modules/api/api.service';
import { NotificationService } from '../../../../shared/modules/notification/notification.service';
import { SubComponent } from '../../../../root/classes/subComponent';

type FileSelectorType = {
    code: string;
    state: string;
    added_files: string[];
};
@Component({
    selector: 'form-file-select',
    templateUrl: './file-select.component.html',
    styleUrls: ['./file-select.component.css'],
})
export class FileSelectComponent extends SubComponent {
    constructor(private api: ApiService, private notifyService: NotificationService) {
        super();
    }

    data: FileSelectorType = {
        code: '',
        state: '',
        added_files: [],
    };

    deleteFiles(index: number) {
        this.data.added_files.splice(index, 1);
    }

    addFileInput() {
        this.data.added_files.push('');
    }

    // Currently not used since it is not clear if the backend supports this.
    onFileSelected(event: any, index: number, action: string) {
        const file: File = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const path = this.api.fileUpload(formData);
            path.subscribe({
                next: (file: any) => {
                    if (action === 'file') {
                        this.data.added_files[index] = file.path;
                    } else if (action === 'code') {
                        this.data.code = file.path;
                    } else if (action === 'state') {
                        this.data.state = file.path;
                    }
                },
                error: () => {
                    this.notifyService.notify(NotificationType.error, 'File not supported');
                },
            });
        }
    }

    getData(): FileSelectorType {
        return this.data;
    }

    trackByIdx(index: number): any {
        return index;
    }
}
