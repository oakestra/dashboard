import {BadInput} from '../common/bad-input';
import {NotFoundError} from '../common/not-found-error';
import {AppError} from '../common/app-error';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from 'rxjs/operators';

// Set the http options
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable()
export class DataService {

  private url:string = "";
  protected childURL:string = "";

  constructor(private http: HttpClient) {
    this.init();
  }
  init(){
    this.url = this.childURL;
  }

  // TODO add Application ID as Argument and request only the correct ones.
  getAll() {
    return this.http.get(this.url, httpOptions)
      .pipe(
        catchError(DataService.handleError)
      );
  }

  create(resource:any) {
    return this.http.post(this.url, JSON.stringify(resource))
      .pipe(
        catchError(DataService.handleError)
      );
  }

  update(resource:any) {
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({isRead: true}))
      .pipe(catchError(DataService.handleError));
  }

  delete(id:number) {
    return this.http.delete(this.url + '/' + id)
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
