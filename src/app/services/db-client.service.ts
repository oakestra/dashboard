import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Application} from "../objects/application";
import firebase from "firebase/compat";
import App = firebase.app.App;
import application from "@angular-devkit/build-angular/src/babel/presets/application";

@Injectable({
  providedIn: 'root'
})
export class DbClientService {

  itemsRef = this.db.list('/application');
  items = this.itemsRef.valueChanges();

  private _applications$: any;

  constructor(private db: AngularFireDatabase) {
    this._applications$  = this.items;
    // this._applications$  = db.list("/application").valueChanges();
  }

  get applications$() {
    return this._applications$;
  }

  addItem(data: any) {

    let ref = this.db.database.ref("/application")
    const usersRef = ref.child(data.id+"");
    usersRef.set({
      id: data.id,
      name: data.name,
      description: data.description,
    });
  }

  //TODO Make id as String
  deleteItem(data: any) {
    this.itemsRef.remove(data.id+'');
  }

  updateItem(data: any) {
    this.itemsRef.update(data.id+'', {
      id: data.id,
      name: data.name,
      description: data.description
    });
  }

/*
  deleteEverything() {
    this.itemsRef.remove();
  }
  */
}
