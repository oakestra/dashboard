import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-edit-user.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    '.cancelButton{background-color: #7b97a5}',
    '.updateButton{background-color: #4a7083}',
    '.input{padding-right: 8px}',
  ],
})
export class DialogEditUserView {
  action: string;
  title: string;
  local_data: any;
  form;
  rolDB: any;
  buttonText = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserView>,
    private fb: FormBuilder,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = data.obj;
    this.action = data.action;
    this.rolDB = data.roles;
    this.title = 'Editing user...';

    if (this.data.action == 'edit') {
      this.buttonText = 'Save changes';

      this.form = fb.group({
        name: [this.local_data.name, UserValidators.containsWhitespace],
        email: [this.local_data.email],
        roles: fb.group({
          Admin: this.local_data.roles.some((r: any) => r.name == 'Admin'),
          Application_Provider: this.local_data.roles.some((r: any) => r.name == 'Application_Provider'),
          Infrastructure_Provider: this.local_data.roles.some((r: any) => r.name == 'Infrastructure_Provider'),
        }),
      });
    } else {
      this.buttonText = 'Create';
      this.title = 'Create new user...';

      this.form = fb.group({
        name: ['', UserValidators.containsWhitespace],
        email: [''],
        password: [''],
        roles: fb.group({
          Admin: false,
          Application_Provider: false,
          Infrastructure_Provider: false,
        }),
      });
    }
  }

  get name() {
    return this.form.value.name;
    // return this.form.get('name')!;
    // TODO Check if this works
  }

  doAction() {
    const roles = this.form.value.roles;
    this.local_data.roles = [];

    // TODO FIX ME -> check what is to fix here and why the working code is commented
    // check in the backend if the structure has changed
    /*
    for (let r of this.rolDB) {
      if (roles[r.name]) {
        this.local_data.roles.push(r)
      }
    }
    this.form.value.roles = this.local_data.roles;
    this.form.value.created_at = this.local_data.created_at
    this.form.value._id = this.local_data._id
    */

    this.dialogRef.close({ event: this.action, data: this.form.value });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

export class UserValidators {
  static containsWhitespace(control: AbstractControl): Validators | null {
    if ((control.value as string).indexOf(' ') > 0) {
      return { containsWhitespace: true };
    } else {
      return null;
    }
  }
}
