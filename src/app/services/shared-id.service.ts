import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SharedIDService {

  private _sharedNode: any = null;

  constructor() {}

  public set sharedNode(value: any) {
    this._sharedNode = value;
  }

  public get sharedNode(): any {
    return this._sharedNode!;
  }
}

