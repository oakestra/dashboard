import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICluster } from 'src/app/root/interfaces/cluster';
import { appReducer, getClusters } from 'src/app/root/store';
import { selectAllClusters } from 'src/app/root/store/selectors/cluster.selector';
import { AddonsApiService } from '../../addons/services/addons-api.service';

type ClusterTab = 'overview' | 'addons' | 'hooks' | 'resources';

@Component({
    standalone: false,
    selector: 'app-cluster-detail',
    templateUrl: './cluster-detail.component.html',
    styleUrls: ['./cluster-detail.component.scss'],
})
export class ClusterDetailComponent implements OnInit {
    activeTab: ClusterTab = 'overview';
    cluster$: Observable<ICluster | undefined> = combineLatest([
        this.store.pipe(select(selectAllClusters)),
        this.route.paramMap,
    ]).pipe(
        map(([clusters, params]) => {
            const clusterId = params.get('clusterId') || '';
            return clusters.find((cluster) => this.getClusterKey(cluster) === clusterId || cluster.cluster_name === clusterId);
        }),
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<appReducer.AppState>,
        private addonsApi: AddonsApiService,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getClusters());
    }

    setTab(tab: ClusterTab): void {
        this.activeTab = tab;
    }

    backToClusters(): void {
        void this.router.navigate(['/control/clusters']);
    }

    getClusterKey(cluster: ICluster): string {
        return cluster._id?.$oid || cluster.cluster_name;
    }

    convertMemoryToGB(memory: number): number {
        return Math.round(memory / 1024);
    }

    getAddonsEndpoint(cluster: ICluster): string {
        return this.addonsApi.getClusterEndpoints(cluster).addonsEngineUrl;
    }

    getResourceEndpoint(cluster: ICluster): string {
        return this.addonsApi.getClusterEndpoints(cluster).resourceAbstractorUrl;
    }
}
