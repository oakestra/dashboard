import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, takeWhile, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../../../root/store/reducers/app.reducer';
import { IService } from '../../../root/interfaces/service';
import { selectCurrentServices } from '../../../root/store/selectors/service.selector';
import { getSingleService } from '../../../root/store';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-service-status.html',
    styles: [
        '.full-width{width: 100%}',
        '.alignRight{text-align: right}',
        'h2{min-width: 70vw}',
        '.information{padding-top: 10px}',
    ],
})
export class DialogServiceStatusView implements OnInit, OnDestroy {
    instanceNumber: number;
    service: IService;

    latestData: string;
    private alive = true;
    private timerSubscription: Subscription;

    instance = this.store.select(selectCurrentServices).pipe(
        map((services: IService[]) => {
            const myService: IService = services.find((service) => service._id.$oid === this.service._id.$oid);
            if (myService && myService.instance_list.length > 0) {
                return myService.instance_list.find((instance) => instance.instance_number === this.instanceNumber);
            }
            return null;
        }),
    );

    constructor(
        public dialogRef: MatDialogRef<DialogServiceStatusView>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private store: Store<AppState>,
    ) {
        this.service = data.service;
        this.instanceNumber = data.instanceNumber;
        console.log(data);
    }

    ngOnInit() {
        this.refreshData();
        this.timerSubscription = timer(15000, 15000)
            .pipe(takeWhile(() => this.alive))
            .subscribe(() => this.refreshData());

        this.instance.subscribe((i) => console.log(i));
    }

    ngOnDestroy() {
        this.alive = false;
        this.timerSubscription.unsubscribe();
    }

    refreshData() {
        this.store.dispatch(getSingleService({ serviceId: this.service._id.$oid }));
        console.log('Update');
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
