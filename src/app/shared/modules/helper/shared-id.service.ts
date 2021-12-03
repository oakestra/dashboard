import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

export class SharedIDService {

  private applicationService = new BehaviorSubject<any>(null);

  applicationObservable$ = this.applicationService.asObservable();

  selectApplication(data: any) {
    this.applicationService.next(data);
  }

  jobs:any
  setJobs(jobs: any){
    this.jobs = jobs;
  }
}

