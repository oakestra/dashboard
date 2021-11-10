import {ErrorHandler} from "@angular/core";

export class AppErrorHandler implements ErrorHandler{
  handleError(error: any) {
    //TODO Log the error on the server or somewhere else
    alert('An unexpected error occurred');
    console.log(error);
  }
}
