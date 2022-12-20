import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Store } from '@ngrx/store';
import { appReducer } from '../../../root/store';

@Injectable({
    providedIn: 'root',
})

// TODO Do not use this anymore
export class SharedIDService {
    constructor(private store: Store<appReducer.AppState>) {}

    private clusterService = new BehaviorSubject<any>(null);
    private applicationService = new BehaviorSubject<any>(null);
    private _userID = '';

    selectCluster(data: any) {
        this.clusterService.next(data);
    }

    selectApplication(data: any) {
        this.applicationService.next(data);
    }

    get clusterObserver$() {
        return this.clusterService.asObservable();
    }

    get applicationObserver$() {
        return this.applicationService.asObservable();
    }

    set userID(id: string) {
        this._userID = id;
    }

    get userID() {
        return this._userID;
    }
}
