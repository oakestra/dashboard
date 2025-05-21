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
    private clusterListHtml: string;
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
        return Math.round(memory / 1024 );
      }

    convertCpuToPercentage(cpu_usage: number, cores: number): number {
        return Math.round(cpu_usage*100 / cores );
    }

}

