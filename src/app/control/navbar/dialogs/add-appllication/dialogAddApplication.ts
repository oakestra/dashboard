import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { IApplication } from '../../../../root/interfaces/application';
import { DialogAction } from '../../../../root/enums/dialogAction';
import { IDialogAttribute } from '../../../../root/interfaces/dialogAttribute';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-add-application.html',
    styleUrls: ['./dialog-add-application.scss'],
})
export class DialogAddApplicationView implements OnInit {
    DialogAction = DialogAction;
    action: DialogAction;
    app: IApplication;
    title = 'Add Application';
    buttonText = 'Add';
    @Input() data: IDialogAttribute;

    constructor(public dialogRef: NbDialogRef<DialogAddApplicationView>) {}

    ngOnInit(): void {
        this.action = this.data.action;
        this.app = { ...this.data.content } as IApplication;
        if (this.action === DialogAction.UPDATE) {
            this.title = 'Modify Application';
            this.buttonText = 'Update';
        }
    }

    doAction() {
        this.dialogRef.close({ event: this.action, data: this.app });
    }

    deleteApplication() {
        this.dialogRef.close({ event: DialogAction.DELETE, data: this.app });
    }

    closeDialog() {
        this.dialogRef.close({ event: DialogAction.CANCEL });
    }
}
