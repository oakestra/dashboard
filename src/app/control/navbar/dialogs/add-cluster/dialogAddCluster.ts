import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NotificationService } from '../../../../shared/modules/notification/notification.service';
import { NotificationType } from '../../../../root/interfaces/notification';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: './dialog-add-cluster.html',
    styleUrls: ['./dialog-add-cluster.scss'],
})

// TODO Check if this code works and improve it (.ts .html file)
export class DialogAddClusterView implements OnInit {
    @Input() data: any;
    action: string;
    local_data: any;
    title = 'Add Cluster';
    zoom = 8;

    lat_form = new FormControl();
    lng_form = new FormControl();
    my_radius = 20;
    marker: any;
    circlemarker: any;

    constructor(public dialogRef: NbDialogRef<DialogAddClusterView>, private notifyService: NotificationService) {
        this.local_data = { ...this.data };
        this.action = this.local_data.action;

        if (this.action === 'Add') {
            this.title = 'Add Cluster';
        }
        /* if (this.action == 'Update') {
        this.title = "Modify Cluster" }*/
    }
    private map: any;
    // FMI Garching coordinates
    private lat = 48.262707753772624;
    private lon = 11.668009155278707;

    radiusChange(new_val: any) {
        this.my_radius = new_val.value;
        if (!this.map) {
            return;
        }
        this.map.removeLayer(this.circlemarker);
        // this.circlemarker = L.circleMarker([this.lat, this.lon], { radius: new_val.value });
        this.circlemarker.addTo(this.map).addTo(this.map);
    }

    ngOnInit(): void {}

    doAction() {
        console.log(this.local_data);

        if (this.local_data.cluster_name.length < 3) {
            this.notifyService.notify(NotificationType.error, 'Please provide a valid cluster name.');
        } else if (this.local_data.cluster_latitude === '' || this.local_data.cluster_longitude === '') {
            this.notifyService.notify(NotificationType.error, 'Please provide a valid location.');
        } else {
            this.dialogRef.close({ event: this.action, data: this.local_data });
        }
    }

    deleteCluster() {
        this.dialogRef.close({ event: 'Delete', data: this.local_data });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
