import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DialogAction } from '../../../../root/enums/dialogAction';
import { appReducer, getAllUser } from '../../../../root/store';
import { IUser } from '../../../../root/interfaces/user';
import { selectAllUser } from '../../../../root/store/selectors/user.selector';

@Component({
    selector: 'app-add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
    @Input() data: any;
    DialogAction = DialogAction;
    searchText = '';
    user: IUser[];
    userFiltered: IUser[] = [];
    selection: any;

    public user$: Observable<IUser[]> = this.store.pipe(select(selectAllUser));

    constructor(
        public dialogRef: NbDialogRef<AddMemberComponent>,
        private store: Store<appReducer.AppState>,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.store.dispatch(getAllUser({ organization_id: '' }));

        this.user$.subscribe((user) => {
            const organizationUser = this.data.currentMember.map((u: IUser) => u.name);
            this.user = user.filter((u) => !organizationUser.includes(u.name));

            this.selection = this.fb.group(
                this.user
                    .map((u) => u.name)
                    .reduce((obj: any, entry) => {
                        obj[entry] = false;
                        return obj;
                    }, {}),
            );

            this.search('');
        });
    }

    doAction() {
        const newMember = Object.keys(this.selection.value).filter((key) => this.selection.value[key]);
        this.user = this.user.filter((u) => newMember.includes(u.name));
        this.dialogRef.close({ event: DialogAction.ADD, data: this.user });
    }

    closeDialog() {
        this.dialogRef.close({ event: DialogAction.CANCEL });
    }

    resetSearch() {
        this.searchText = '';
        this.search('');
    }

    search(event: any) {
        console.log(event);
        this.userFiltered = this.user.filter((u) => u.name.toLowerCase().indexOf(event?.toLowerCase() ?? '') !== -1);
    }
}
