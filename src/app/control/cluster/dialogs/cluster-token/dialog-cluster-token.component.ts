import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

export interface ITokenDialogData {
    token: string;
    expires_at: string;
    address: string;
    port: number;
    addressLabel: string;
    suggested_command: string;
}

@Component({
    selector: 'app-dialog-cluster-token',
    templateUrl: './dialog-cluster-token.component.html',
    styleUrls: ['./dialog-cluster-token.component.scss'],
})
export class DialogClusterTokenComponent {
    @Input() title: string;
    @Input() data: ITokenDialogData;

    tokenCopied = false;
    commandCopied = false;

    constructor(public dialogRef: NbDialogRef<DialogClusterTokenComponent>) {}

    copyToken() {
        navigator.clipboard.writeText(this.data.token).then(() => {
            this.tokenCopied = true;
            setTimeout(() => (this.tokenCopied = false), 2000);
        });
    }

    copyCommand() {
        navigator.clipboard.writeText(this.data.suggested_command).then(() => {
            this.commandCopied = true;
            setTimeout(() => (this.commandCopied = false), 2000);
        });
    }

    close() {
        this.dialogRef.close();
    }
}
