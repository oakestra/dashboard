import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ICon_constraints, IConnectivity, IService } from '../../../../root/interfaces/service';
import { DialogConnectionSettingsView } from '../../../dialogs/content-connection/dialog-connection-settings-view.component';
import { SubComponent } from '../../../../root/classes/subComponent';
import { selectCurrentServices } from '../../../../root/store/selectors/service.selector';
import { appReducer } from '../../../../root/store';

@Component({
    selector: 'form-connectivity',
    templateUrl: './connectivity.component.html',
    styleUrls: ['./connectivity.component.css'],
})
export class ConnectivityComponent extends SubComponent implements OnInit {
    @Input() service: IService;
    connectivity: IConnectivity[] = [];
    services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    dropdownServices: IService[];

    constructor(public dialog: MatDialog, private store: Store<appReducer.AppState>) {
        super();
    }

    ngOnInit(): void {
        this.connectivity = this.service?.connectivity ?? [];
        this.services$
            .pipe(
                map((s) =>
                    this.service ? s.filter((service) => service.microserviceID !== this.service.microserviceID) : s,
                ),
                tap((filteredServices) => (this.dropdownServices = filteredServices)),
            )
            .subscribe();
        console.log(this.dropdownServices);
    }

    addConnectivity() {
        const c: IConnectivity = {
            con_constraints: [],
            target_microservice_id: '',
        };
        this.connectivity.push(c);
    }

    deleteConnection(index: number) {
        this.connectivity.splice(index, 1);
    }

    openDialog(index: number) {
        const dialogRef = this.dialog.open(DialogConnectionSettingsView, { data: this.connectivity[index] });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            this.saveDialogData(result, index);
        });
    }

    // Saving the Dialog Data to the Array and the Form
    saveDialogData(data: ICon_constraints, index: number) {
        if (this.connectivity[index].con_constraints.length === 0) {
            // Why the if?
            const entry: ICon_constraints = {
                type: data.type,
                threshold: data.threshold,
                rigidness: data.rigidness,
                convergence_time: data.convergence_time,
            };
            this.connectivity[index].con_constraints.push(entry);
        }
        // TODO implement also that updates are possible
    }

    getData(): any {
        return {
            connectivity: this.connectivity,
        };
    }
}
