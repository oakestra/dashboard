import { Injectable } from '@angular/core';
import {Application} from "../objects/application";

@Injectable({
  providedIn: 'root'
})
export class SharedIDService {

  private _sharedNode: Application | undefined;

  constructor() { }

  public set sharedNode(value: Application) {
    this._sharedNode = value;
  }

  public get sharedNode(): Application {
    return this._sharedNode!;
  }
}
