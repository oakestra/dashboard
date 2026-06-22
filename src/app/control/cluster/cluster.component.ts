import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { ICluster } from '../../root/interfaces/cluster';
import { selectAllClusters } from '../../root/store/selectors/cluster.selector';
import { UserService } from '../../shared/modules/auth/user.service';
import { Observable } from 'rxjs';
import {
    appReducer,
    getClusters,
} from '../../root/store';
import { ApiService } from '../../shared/modules/api/api.service';
import { DialogClusterTokenComponent } from './dialogs/cluster-token/dialog-cluster-token.component';


@Component({
    selector: 'app-cluster',
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.scss'],
})

export class ClusterComponent implements OnInit {

    public clusters$: Observable<ICluster[]> = this.store.pipe(select(selectAllClusters));
    clusters: ICluster[] = [];
    clusterTokenLoading = false;
    workerTokenLoading = false;
    selectedClusterId: string | null = null;

    constructor(
        public dialog: NbDialogService,
        public userService: UserService,
        private router: Router,
        private store: Store<appReducer.AppState>,
        private apiService: ApiService,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getClusters());
        this.clusters$.subscribe((c) => (this.clusters = c));
    }

    generateClusterToken() {
        this.clusterTokenLoading = true;
        this.apiService.generateClusterToken().subscribe({
            next: (t) => {
                this.clusterTokenLoading = false;
                this.dialog.open(DialogClusterTokenComponent, {
                    context: {
                        title: 'Cluster Registration Token',
                        data: {
                            token: t.token,
                            expires_at: t.expires_at,
                            address: t.root_address,
                            port: t.root_port,
                            addressLabel: 'Root address',
                            suggested_command: t.suggested_command,
                        },
                    },
                    closeOnBackdropClick: true,
                });
            },
            error: () => { this.clusterTokenLoading = false; },
        });
    }

    generateWorkerToken() {
        const clusterId = this.selectedClusterId;
        if (!clusterId) return;
        this.workerTokenLoading = true;
        this.apiService.generateWorkerToken(clusterId).subscribe({
            next: (t) => {
                this.workerTokenLoading = false;
                this.dialog.open(DialogClusterTokenComponent, {
                    context: {
                        title: 'Worker Registration Token',
                        data: {
                            token: t.token,
                            expires_at: t.expires_at,
                            address: t.cluster_address,
                            port: t.cluster_port,
                            addressLabel: 'Cluster address',
                            suggested_command: t.suggested_command,
                        },
                    },
                    closeOnBackdropClick: true,
                });
            },
            error: () => { this.workerTokenLoading = false; },
        });
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }

    convertMemoryToGB(memory: number): number {
        return Math.round(memory / 1024);
    }

    convertCpuToPercentage(cpu_usage: number, cores: number): number {
        return Math.round(cpu_usage * 100 / cores);
    }

}
