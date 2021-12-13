import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DialogChangePasswordView} from "../../dialogs/change-password/dialogChangePassword";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../shared/modules/auth/user.service";
import {ApiService} from "../../../shared/modules/api/api.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  form: FormGroup;

  user: any
  dataReady = false;

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private userService: UserService,
              private api: ApiService) {
    this.form = fb.group({
      'name': []
    })
  }

  ngOnInit(): void {
    let username = this.userService.getUsername()
    this.api.getUserByName(username).subscribe((data: any) => {
      this.user = data
      console.log(this.user)
      this.dataReady = true;
    })
  }

  onSubmit() {
    console.log("submit")
  }

  openDialog(obj: any) {
    this.dialog.open(DialogChangePasswordView, {data: obj});
  }

}
