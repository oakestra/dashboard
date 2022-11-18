import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class SharedIDService {
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
