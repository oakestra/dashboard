import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../root/interfaces/application';
import { DialogAction } from '../../../root/enums/dialogAction';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-add-application.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    '.input{padding-right: 8px}',
    '.deleteButton{background-color: #e07074}',
    '.cancelButton{background-color: #7b97a5}',
    '.updateButton{background-color: #4a7083}',
  ],
})
export class DialogAddApplicationView {
  DialogAction = DialogAction;
  action: DialogAction;
  app: IApplication;
  title = 'Add Application';

  constructor(
    public dialogRef: MatDialogRef<DialogAddApplicationView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogAttribute,
  ) {
    this.app = data.content as IApplication;
    if (this.action === DialogAction.UPDATE) {
      this.title = 'Modify Application';
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
