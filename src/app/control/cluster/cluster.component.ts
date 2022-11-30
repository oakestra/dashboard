import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ICluster } from '../../root/interfaces/cluster';
import { DialogConfirmationView } from '../dialogs/confirmation/dialogConfirmation';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { ApiService } from '../../shared/modules/api/api.service';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService } from '../../shared/modules/auth/auth.service';
import { NotificationType } from '../../root/interfaces/notification';

@Component({
    selector: 'app-cluster',
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.css'],
})
export class ClusterComponent implements OnInit {
    clusters: ICluster[]; // Make this as input form parent class

    private map: any;

    // FMI Garching coordinates
    private lat = 48.262707753772624;
    private lon = 11.668009155278707;

    constructor(
        private observer: BreakpointObserver,
        public dialog: MatDialog,
        private api: ApiService,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.initMap();
    }

    private initMap(): void {
        this.map = L.map('card_map', {
            center: [this.lat, this.lon],
            attributionControl: false,
            zoom: 14,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 13,
        }).addTo(this.map);
    }

    deleteCluster(cluster: ICluster) {
        const data = {
            text: 'Delete cluster: ' + cluster.cluster_name,
            type: 'cluster',
        };
        const dialogRef = this.dialog.open(DialogConfirmationView, { data });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === true) {
                this.api.deleteCluster(cluster._id.$oid).subscribe({
                    next: () => {
                        this.notifyService.notify(
                            NotificationType.success,
                            'Cluster ' + cluster.cluster_name + ' deleted successfully!',
                        );
                        this.redirectTo('/control');
                    },
                    error: () => {
                        this.notifyService.notify(
                            NotificationType.error,
                            'Error: Deleting cluster ' + cluster.cluster_name,
                        );
                    },
                });
            }
        });
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }
}
