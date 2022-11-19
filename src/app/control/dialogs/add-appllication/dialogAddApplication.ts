import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../root/interfaces/application';

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
  action: string;
  app: IApplication; // TODO SET to Application
  title = 'Add Application';

  constructor(
    public dialogRef: MatDialogRef<DialogAddApplicationView>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.app = { ...data } as IApplication;
    this.action = { ...data.action };
    if (this.action == 'Update') {
      this.title = 'Modify Application';
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: { applications: [this.app] } });
  }

  deleteApplication() {
    this.dialogRef.close({ event: 'Delete', data: this.app });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
