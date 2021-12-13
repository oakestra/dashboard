import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay, filter} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/add-appllication/dialogAddApplication";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {UserService} from "../../shared/modules/auth/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService, Role} from "../../shared/modules/auth/auth.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  active: any
  app: any;

  appSelected = false
  settings = false

  username = ""
  userID = "";

  isAdmin = false

  constructor(private observer: BreakpointObserver,
              public dialog: MatDialog,
              public sharedService: SharedIDService,
              private api: ApiService,
              public userService: UserService,
              private router: Router,
              private authService: AuthService,
              private notifyService: NotificationService
  ) {
    router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showData(e.url)
      })
  }

  showData(url: string) {
    this.settings = (url.includes("help") || url.includes("user") || url.includes("profile"))
  }

  loadData() {
    this.api.getApplicationsOfUser(this.userID).subscribe(result => {
        this.app = result
      }
    )
  }

  ngOnInit(): void {
    this.username = this.userService.getUsername()
    this.api.getUserByName(this.username).subscribe((data: any) => {
      this.userID = data._id.$oid + "";
      this.loadData()
      this.updatePermissions();
    })
  }

  updatePermissions(): void {
    this.authService.hasRole(Role.ADMIN).subscribe((res) => {
      console.log(res)
      this.isAdmin = res
    });
  }

  // For the responsive sidenav
  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close().then(_r => {
          });
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open().then(_r => {
          });
        }
      });
  }

  openDialog(action: string, obj: any) {
    if (action == "Add") {
      obj._id = {$oid: ""}; // Only for the view, is then defined in the database
      obj.name = "";
      obj.namespace = ""
      obj.description = "";
      obj.userId = this.userID;
    }

    obj.action = action;
    const dialogRef = this.dialog.open(DialogAddApplicationView, {data: obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addApplication(result.data)
      } else if (result.event == 'Update') {
        this.updateApplication(result.data);
      } else if (result.event == 'Delete') {
        this.deleteApplication(result.data)
      }
    });
  }

  deleteApplication(user: any): void {
    this.api.deleteApplication(user).subscribe((_success) => {
        this.notifyService.notify(Type.success, "User " + user.name + " deleted successfully!")
        this.loadData();
      },
      (_error) => {
        this.notifyService.notify(Type.error, "Error: Deleting user " + user.name + " failed!")
      })
  }

  addApplication(user: any): void {
    this.api.addApplication(user).subscribe((_success) => {
        this.loadData();
      },
      (_error: any) => {
        this.notifyService.notify(Type.success, "Error: Adding user " + user.name + " failed!")
      })
  }

  updateApplication(user: any): void {
    this.api.updateApplication(user).subscribe((_success) => {
        this.notifyService.notify(Type.success, "User " + user.name + " deleted successfully!")
        this.loadData();
      },
      (_error) => {
        this.notifyService.notify(Type.error, "Error: Updating user " + user.name + " failed!")
      })
  }

  handleChange() {
    let application = this.api.getAppById(this.active.$oid);
    this.sharedService.selectApplication(application)
    this.appSelected = true
    this.router.navigate(['/control']);
  }

  show() {
    this.appSelected = true
  }

  logout() {
    this.authService.clear()
    this.userService.logout()
  }
}


