import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

export class SharedIDService {

  private applicationService = new BehaviorSubject<any>(null);

  selectApplication(data: any) {
    this.applicationService.next(data);
  }

  get applicationObserver$() {
    return this.applicationService.asObservable()
  }

}

