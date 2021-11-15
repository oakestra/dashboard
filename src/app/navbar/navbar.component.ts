import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay, take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/dialogAddApplication";
import {Application} from "../objects/application";
import {SharedIDService} from "../services/shared-id.service";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {DbClientService} from "../services/db-client.service";
import firebase from "firebase/compat";
import App = firebase.app.App;
import {Observable} from "rxjs";

// import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  applicationList: Application[];
  active: number;
  app$: any;

  constructor(private observer: BreakpointObserver,
              public dialog: MatDialog,
              private sharedService: SharedIDService,
              private dbService: DbClientService,
  ) {

    this.app$ = dbService.applications$;


    this.applicationList = [new Application(1, "", "")];
    sharedService.sharedNode = this.applicationList[0];
    this.active = this.applicationList[0].id;

    this.applicationList = dbService.applications$;
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  //TODO do it right and generate for every Application a unque id.
  appId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.floor(Math.random()*10000) + 1;
  };

  openDialog(action: string, obj: any) {
    if(action == "Add"){
      obj.id = this.appId();
      obj.name = "";
      obj.description = "";
    }
    obj.action = action;
    const dialogRef = this.dialog.open(DialogAddApplicationView, {data: obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addApplication(result.data);
      } else if (result.event == 'Update') {
        this.updateApplication(result.data);
      } else if (result.event == 'Delete') {
        this.deleteApplication(result.data);
      }
    });
  }

  addApplication(data: any) {
    this.dbService.addItem(data);
  }

  updateApplication(data: any) {
    this.dbService.updateItem(data);
  }

  deleteApplication(data: any) {
    this.dbService.deleteItem(data);
  }

  ngOnInit(): void {
  }

  getApplicationByID(id: number): Application {

    let a: Application | undefined;
    let app = this.app$ as Observable<Application[]>;
    //console.log(app)
    console.log("Hier");
    app.subscribe(x => {
      for(let i = 0; i<x.length; i++){
        if(x[i].id == id){
          // a = x[i];
          console.log("setting");
          this.seA(x[i]);
        }
      }
    });
    console.log("und Hier");
    // app.subscribe(data => {
    //   console.log(data);
    //   a = data.find(i => i.id == id);
    // });
    //console.log(a);
    return a!;
  }

  currentApp!: Application;

  seA(a: Application){
    this.currentApp = a;
    console.log(a)
    this.sharedService.sharedNode = this.currentApp;
  }

  handleChange() {
    this.getApplicationByID(this.active);
    //this.sharedService.sharedNode = this.currentApp;
    console.log(this.active);
  }
}


