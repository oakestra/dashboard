import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../../../../root/enums/roles';
import { IUser } from '../../../../root/interfaces/user';
import { DialogConfirmationView } from '../../../../root/components/dialogs/confirmation/dialogConfirmation';

@Component({
    selector: 'app-member-item',
    templateUrl: './member-item.component.html',
    styleUrls: ['./member-item.component.css'],
})
export class MemberItemComponent implements OnInit {
    @Input() searchedMember: IUser[];
    @Output() removeEvent = new EventEmitter<IUser>();
    @Output() updateRoles = new EventEmitter<IUser>();
    rolesList = Object.values(Role);
    editItem: boolean[];
    roles: FormControl[] = [];

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        this.editItem = this.searchedMember?.map(() => false);
        this.searchedMember.forEach((m) => {
            this.roles.push(new FormControl({ value: m.roles, disabled: true }));
        });
    }

    removeMember(member: any) {
        const data = {
            text: `Remove ${member.name} from organization`,
            type: 'member',
        };

        const dialogRef = this.dialog.open(DialogConfirmationView, { data });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === true) {
                this.removeEvent.emit(member);
            }
        });
    }

    saveRoles(index: number) {
        this.toggleEdit(index);
        this.searchedMember[index].roles = this.roles[index].value;
        this.updateRoles.emit(this.searchedMember[index]);
    }

    toggleEdit(index: number) {
        this.editItem[index] = !this.editItem[index];
        if (this.roles[index].disabled) {
            this.roles[index].enable();
        } else {
            this.roles[index].disable();
        }
    }
}
