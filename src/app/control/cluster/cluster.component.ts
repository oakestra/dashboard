import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/modules/auth/user.service';
import { selectAllClusters } from '../../root/store/selectors/cluster.selector';
import { ICluster } from '../../root/interfaces/cluster';
import {
    appReducer,
    getClusters,
} from '../../root/store';


@Component({
    standalone: false,
    selector: 'app-cluster',
    templateUrl: './cluster.component.html',
    styleUrls: ['./cluster.component.scss'],
})

export class ClusterComponent implements OnInit {

    public clusters$: Observable<ICluster[]> = this.store.pipe(select(selectAllClusters));

    constructor(
        public dialog: NbDialogService,
        public userService: UserService,
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
        return Math.round(memory / 1024);
    }

    convertCpuToPercentage(cpu_usage: number, cores: number): number {
        return Math.round(cpu_usage * 100 / cores);
    }

    openCluster(cluster: ICluster): void {
        void this.router.navigate(['/control/clusters', cluster._id?.$oid || cluster.cluster_name]);
    }

    getClusterId(cluster: ICluster): string {
        return cluster._id?.$oid || cluster.cluster_name;
    }

}
