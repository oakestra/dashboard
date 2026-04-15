import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { ICluster } from '../../root/interfaces/cluster';
import { selectAllClusters } from '../../root/store/selectors/cluster.selector';
import { filter,tap } from 'rxjs/operators';
import { UserService } from '../../shared/modules/auth/user.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import { map } from 'rxjs/operators';
import { ClusterMapComponent } from './clustermap/clustermap.component';
import { ApiService } from '../../shared/modules/api/api.service';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { NotificationType } from '../../root/interfaces/notification';
import {
    appReducer,
    getActiveClusters,
    getClusters,
} from '../../root/store';


@Component({
    selector: 'app-cluster',
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.scss'],
})

export class ClusterComponent implements OnInit {

    public clusters$: Observable<ICluster[]> = this.store.pipe(select(selectAllClusters));
    public clusterNameForToken = '';
    public generatedClusterToken = '';
    public creatingClusterToken = false;
    public clusterTokenError = '';
    private clusterListHtml: string;
    constructor(
        public dialog: NbDialogService,
        public userService: UserService,
        private apiService: ApiService,
        private notifyService: NotificationService,
        private router: Router,
        private store: Store<appReducer.AppState>,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getClusters());
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }

    convertMemoryToGB(memory: number): number {
        return Math.round(memory / 1024 );
      }

    convertCpuToPercentage(cpu_usage: number, cores: number): number {
        return Math.round(cpu_usage*100 / cores );
    }

    createClusterToken(): void {
        const clusterName = this.clusterNameForToken.trim();
        if (!clusterName) {
            this.clusterTokenError = 'Cluster name is required.';
            this.generatedClusterToken = '';
            this.notifyService.notify(NotificationType.error, this.clusterTokenError);
            return;
        }

        this.creatingClusterToken = true;
        this.clusterTokenError = '';
        this.generatedClusterToken = '';

        this.apiService.createClusterToken(clusterName).subscribe(
            (response: any) => {
                const token = this.extractTokenFromResponse(response);
                if (token) {
                    this.generatedClusterToken = token;
                    this.notifyService.notify(NotificationType.success, 'Cluster token created successfully.');
                } else {
                    this.clusterTokenError = 'Cluster token was not found in API response.';
                    this.notifyService.notify(NotificationType.error, this.clusterTokenError);
                }
                this.creatingClusterToken = false;
            },
            (error) => {
                this.clusterTokenError = error?.error?.message || 'Failed to create cluster token.';
                this.notifyService.notify(NotificationType.error, this.clusterTokenError);
                this.creatingClusterToken = false;
            },
        );
    }

    copyClusterToken(): void {
        if (!this.generatedClusterToken) {
            return;
        }

        void navigator.clipboard.writeText(this.generatedClusterToken).then(
            () => {
                this.notifyService.notify(NotificationType.success, 'Cluster token copied to clipboard.');
            },
            () => {
                this.notifyService.notify(NotificationType.error, 'Unable to copy token to clipboard.');
            },
        );
    }

    private extractTokenFromResponse(response: any): string {
        if (typeof response === 'string') {
            return response;
        }

        if (!response || typeof response !== 'object') {
            return '';
        }

        return response.token || response.cluster_token || response.access_token || '';
    }

}

