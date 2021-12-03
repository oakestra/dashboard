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
  title : string
  local_data: any;
  roles: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserView>,
    private fb:FormBuilder,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("Dialog Data")
    this.local_data = data.obj;
    this.action = data.action;
    console.log(this.local_data.roles);

    if(this.action == "edit"){
      this.title = "Editing user..."
      this.roles = fb.group({
        'admin': this.local_data.roles.some((r:any) => r.name == 'Admin_Role'),
        'application_Provider': this.local_data.roles.some((r:any) => r.name == 'application_Provider'),
        'service_Provider': this.local_data.roles.some((r:any) => r.name == 'service_Provider'),})

    }else {
      this.title = "Creating user..."

      this.roles = fb.group({
        'admin': false,
        'application_Provider': false,
        'service_Provider': false,})
    }
  }

  doAction() {

    let roles = Object.entries(this.roles.getRawValue())
    console.log(roles)

    // TODO Add Roles to the user data
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
