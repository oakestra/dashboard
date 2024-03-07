import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-generate-token.html',
    styleUrls: ['./dialog-generate-token.scss'],
})
// TODO Fix this component - what should it do?-->
export class DialogGenerateTokenView {
    @Input() data: any;
    key = new FormControl();
    cluster_name = '';
    username = '';

    constructor(public dialogRef: NbDialogRef<DialogGenerateTokenView>) {
        this.key.setValue(this.data.pairing_key);
        this.cluster_name = this.data.cluster_name;
        this.username = this.data.username;
    }

    copyPairingKey(key: any) {
        key.select();
        document.execCommand('copy');
        key.setSelectionRange(0, 0);
    }

    download(filename: string, key: any) {
        // TODO: Fix SYSTEM_MANAGER_URL (now it is undefined)
        const text = `CLUSTER_NAME=${this.cluster_name}
    SYSTEM_MANAGER_URL=${environment.apiUrl}
    USER_NAME=${this.username}
    CLUSTER_PAIRING_KEY='${key}'`;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
