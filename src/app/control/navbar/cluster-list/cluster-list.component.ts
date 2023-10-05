import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NONE_TYPE } from '@angular/compiler';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { UserService } from '../../../shared/modules/auth/user.service';
import { AuthService } from '../../../shared/modules/auth/auth.service';
import { ICluster } from '../../../root/interfaces/cluster';
import { DialogAddClusterView } from '../dialogs/add-cluster/dialogAddCluster';
import { DialogAction } from '../../../root/enums/dialogAction';
import { DialogGenerateTokenView } from '../dialogs/generate-token/dialogGenerateToken';
import { IId } from '../../../root/interfaces/id';
import { NotificationType } from '../../../root/interfaces/notification';

@Component({
    selector: 'app-cluster-list',
    templateUrl: './cluster-list.component.html',
    styleUrls: ['./cluster-list.component.scss'],
})

// TODO Check if is works and refactor it
export class ClusterListComponent {
    clusters: ICluster[];
    events: string[] = [];

    activeAppId: IId; // is that really needed
    appSelected = false; // can i use activeApp != null?
    settings = false;

    // Get the howl user
    username = '';
    userID = '';

    listClusters = false;
    clusterSelected = false;

    constructor(
        private observer: BreakpointObserver,
        public dialog: MatDialog,
        private api: ApiService,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        private notifyService: NotificationService,
    ) {}

    loadDataCluster() {
        this.api.getClustersOfUser(this.userID).subscribe({
            next: (result: ICluster[]) => {
                this.clusters = result;
                if (result[0]) {
                    this.activeAppId = result[0]._id;
                    this.appSelected = false;
                    this.settings = false;
                    this.listClusters = true;
                    // this.sharedService.selectCluster(result[0]);
                }
            },
            error: () => {
                this.notifyService.notify(NotificationType.error, 'Error: Getting clusters of ' + this.username);
            },
        });
    }

    openDialogCl(action: string, obj: any) {
        if (action === 'Add') {
            obj._id = { $oid: '' };
            obj.cluster_name = '';
            obj.cluster_latitude = '';
            obj.cluster_longitude = '';
            obj.cluster_radius = '20';
            obj.user_name = this.username;
        }
        obj.action = action;
        const dialogRef = this.dialog.open(DialogAddClusterView, {
            data: obj,
        });

        dialogRef.afterClosed().subscribe((result) => {
            // TODO define data for Cluster
            if (result.event === DialogAction.ADD) {
                // this.addCluster(result.data)
                this.userService.addCluster(result.data).subscribe({
                    next: (userServiceResponse: any) => {
                        this.notifyService.notify(NotificationType.success, 'Cluster added successfully!');
                        this.redirectTo('/control');
                        if (userServiceResponse !== NONE_TYPE) {
                            // TODO: We need to pass the system_manager_URL as well
                            const my_data = {
                                pairing_key: userServiceResponse.pairing_key,
                                username: this.username,
                                cluster_name: result.data.cluster_name ?? '',
                            };
                            const dialogKey = this.dialog.open(DialogGenerateTokenView, {
                                data: my_data,
                                height: '40%',
                                width: '50%',
                            });
                            dialogKey.afterClosed().subscribe(() => this.showClusters());
                        }
                    },
                    error: (error) => this.notifyService.notify(NotificationType.error, error),
                });
            }
        });
    }

    handleChangeCluster(cluster: ICluster) {
        this.api.getClusterById(cluster._id.$oid).subscribe((cl) => {
            // this.sharedService.selectCluster(cl);
            console.log(cl);
            this.switchScreen(false, false, true);
            void this.router.navigate(['/control']).then();
        });
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }

    showClusters() {
        this.switchScreen(false, true, false);
    }

    switchScreen(app: boolean, list: boolean, cluster: boolean) {
        this.appSelected = app;
        this.listClusters = list;
        this.clusterSelected = cluster;
    }
}
