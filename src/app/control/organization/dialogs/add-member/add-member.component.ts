import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IApplication } from '../../../../root/interfaces/application';
import { IDialogAttribute } from '../../../../root/interfaces/dialogAttribute';
import { DialogAction } from '../../../../root/enums/dialogAction';
import { appReducer, getAllUser } from '../../../../root/store';
import { IUser } from '../../../../root/interfaces/user';
import { selectAllUser } from '../../../../root/store/selectors/user.selector';

@Component({
    selector: 'app-add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements OnInit {
    DialogAction = DialogAction;
    action: DialogAction;
    app: IApplication;
    title = 'Add Application';
    buttonText = 'Add';
    searchText = '';
    user: IUser[];
    selection: any;

    public user$: Observable<IUser[]> = this.store.pipe(select(selectAllUser));

    constructor(
        public dialogRef: MatDialogRef<AddMemberComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogAttribute,
        private store: Store<appReducer.AppState>,
        private fb: FormBuilder,
    ) {
        this.title = 'Add Member';
        this.buttonText = 'Update';
    }

    ngOnInit() {
        this.store.dispatch(getAllUser());
        this.user$.subscribe((u) => {
            this.user = u;
            console.log(u);
        });

        this.selection = this.fb.group({
            ...this.user,
        });
    }

    doAction() {
        console.log(this.selection);
        // this.dialogRef.close({ event: this.action, data: this.app });
    }

    deleteApplication() {
        this.dialogRef.close({ event: DialogAction.DELETE, data: this.app });
    }

    closeDialog() {
        this.dialogRef.close({ event: DialogAction.CANCEL });
    }
}
