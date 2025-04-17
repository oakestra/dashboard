import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { ICluster } from '../../root/interfaces/cluster';
import { selectAllClusters } from '../../root/store/selectors/cluster.selector';
import { filter,tap } from 'rxjs/operators';
import { UserService } from '../../shared/modules/auth/user.service';
import { Observable } from 'rxjs';
import {
    appReducer,
    getActiveClusters,
} from '../../root/store';

@Component({
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
        this.store.dispatch(getActiveClusters());
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }
}
