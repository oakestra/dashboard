import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-edit-user.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogEditUserView {

  action: string;
  title: string
  local_data: any;
  roles: FormGroup;

  rolDB: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserView>,
    private fb: FormBuilder,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.local_data = data.obj;
    this.action = data.action;
    this.rolDB = data.roles;

    this.title = "Editing user..."

    if (this.action == "edit") {
      this.roles = fb.group({
        'Admin_Role': this.local_data.roles.some((r: any) => r.name == 'Admin_Role'),
        'Application_Provider': this.local_data.roles.some((r: any) => r.name == 'Application_Provider'),
        'Infrastructure_Provider': this.local_data.roles.some((r: any) => r.name == 'Infrastructure_Provider'),
      })

    } else {
      this.roles = fb.group({
        'Admin_Role': false,
        'Application_Provider': false,
        'Infrastructure_Provider': false
      })
    }
  }

  doAction() {

    let roles = this.roles.value

    for (let r of this.rolDB) {
      if (roles[r.name])
        this.local_data.roles.push(r)
    }
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
