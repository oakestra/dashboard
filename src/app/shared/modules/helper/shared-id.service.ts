import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

export class SharedIDService {

  // private applicationService = new Subject<any>();
  private applicationService = new BehaviorSubject<any>(null);
  applicationObservable$ = this.applicationService.asObservable();

  private _application:any = null

  get application(): any {
    return this._application;
  }

  selectApplication(data: any) {
    this.applicationService.next(data);
    this._application = data
  }

  // jobs:any
  // setJobs(jobs: any){
  //   this.jobs = jobs;
  // }
}

