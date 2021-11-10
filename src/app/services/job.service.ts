import { DataService } from './data.service';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
//TODO Change name of Service
export class JobService extends DataService {

  constructor(http: HttpClient) {
    super(http);
  }
  init() {
    this.childURL = "http://192.168.42.173:10000/api/jobs";
    super.init();
  }

}
