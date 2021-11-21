import {Injectable} from '@angular/core';
import {BadInput} from '../common/bad-input';
import {NotFoundError} from '../common/not-found-error';
import {AppError} from '../common/app-error';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from 'rxjs/operators';

// Set the http options
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json", "Authorization": "c31z"})
};

@Injectable()
export class DataService {

  private url: string = "http://192.168.42.173:10000/api/jobs";

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {}

  // TODO add Application ID as Argument and request only the correct ones.
  getAll() {
    return this.http.get(this.url, httpOptions)
      .pipe(
        catchError(DataService.handleError)
      );
  }

  // TODO change to dynamic ip in url
  delete(id: string) {
    return this.http.delete('http://192.168.42.173:10000/api/delete' + id)
      .pipe(catchError(DataService.handleError));
  }

  private static handleError(error: Response) {
    if (error.status === 400)
      return Observable.throw(new BadInput(error.json()));

    if (error.status === 404)
      return Observable.throw(new NotFoundError());

    return Observable.throw(new AppError(error));
  }
}
