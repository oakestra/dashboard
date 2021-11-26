import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/dialogAddApplication";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {UserService} from "../../shared/modules/auth/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  active: any
  app$: any;
  appSelected = false

  username = ""

  constructor(private observer: BreakpointObserver,
              public dialog: MatDialog,
              public sharedService: SharedIDService,
              private dbService: DbClientService,
              public userService: UserService) {
    this.app$ = dbService.applications$;
  }

  ngOnInit(): void {
    this.username = this.userService.getUsername()
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

  openDialog(action: string, obj: any) {
    if (action == "Add") {
      obj._id = {$oid: ""}; // Only for the view, is then defined in the database
      obj.name = "";
      obj.description = "";
      obj.microservices = [];
    }

    obj.action = action;
    const dialogRef = this.dialog.open(DialogAddApplicationView, {data: obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.dbService.addApplication(result.data);
        this.app$ = this.dbService.applications$;
      } else if (result.event == 'Update') {
        this.dbService.updateApplication(result.data);
        this.app$ = this.dbService.applications$;
      } else if (result.event == 'Delete') {
        this.dbService.deleteApplication(result.data);
        this.app$ = this.dbService.applications$;
      }
    });
  }

  handleChange() {
    let application = this.dbService.getAppById(this.active.$oid);
    this.sharedService.selectApplication(application)

    this.appSelected = true
  }

  logout() {
    this.userService.logout()
  }
}


