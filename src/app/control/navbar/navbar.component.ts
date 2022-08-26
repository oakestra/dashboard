import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay, filter} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/add-appllication/dialogAddApplication";
import {DialogAddClusterView} from "../dialogs/add-cluster/dialogAddCluster";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {UserService} from "../../shared/modules/auth/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService, Role} from "../../shared/modules/auth/auth.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";
import {NONE_TYPE} from "@angular/compiler";
import {DialogGenerateTokenView} from "../dialogs/generate-token/dialogGenerateToken";
import {DialogConfirmation} from "../dialogs/confirmation/dialogConfirmation";
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import * as L from "leaflet";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav

  active: any
  app: any
  appSelected = false
  settings = false
  username = ""
  userID = ""
  clusterID = ""
  isAdmin = false
  clusters: any
  clustersSelected = false

  events: string[] = []
  opened: boolean = true

  private map: any;
  // FMI Garching coordinates
  private lat = 48.262707753772624;
  private lon =  11.668009155278707;

  constructor(private observer: BreakpointObserver,
              public dialog: MatDialog,
              public sharedService: SharedIDService,
              private api: ApiService,
              public userService: UserService,
              private router: Router,
              private authService: AuthService,
              private notifyService: NotificationService) {
    router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showData(e.url)
      })
  }

  private initMap(): void {

    this.map = L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // Search location in map
    let search = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      marker: {
        draggable: true
      },
    });
    this.map.addControl(search);
  }

  ngOnInit(): void {
    this.username = this.userService.getUsername()
    this.api.getUserByName(this.username).subscribe((data: any) => {
      this.userID = data._id.$oid
    })
      this.sharedService.userID = this.userID
      // this.surveyService.resetSurvey()

      this.loadDataCluster()
      this.loadDataApplication()
      this.updatePermissions()

      this.initMap()
  }

  showData(url: string) {
    this.settings = (url.includes("help") || url.includes("user") || url.includes("profile") || url.includes("survey"))
  }

  loadDataApplication() {
    this.api.getApplicationsOfUser(this.userID).subscribe((result: any) => {
        this.app = result
        if (result[0]) {
          this.active = result[0]._id
            this.clustersSelected = false
            this.appSelected = true
          this.sharedService.selectApplication(result[0])
        }
      }
    )
  }

  loadDataCluster() {
    this.api.getClustersOfUser(this.userID).subscribe((result: any) => {
          this.clusters = result
          this.appSelected = false
          this.settings = false
          this.clustersSelected = true
        },
        (_error: any) => {
          this.notifyService.notify(Type.error, 'Error: Getting clusters of ' + this.username)
        })
  }

  updatePermissions(): void {
    this.authService.hasRole(Role.ADMIN).subscribe((res) => {
      console.log(res)
      this.isAdmin = res
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate([uri]));
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

  openDialogCl(action: string, obj: any) {
    if (action == 'Add') {
      obj._id = {$oid: ""} // Only for the view, is then defined in the database
      obj.cluster_name = ""
      obj.cluster_latitude= ""
      obj.cluster_longitude = ""
      obj.cluster_radius = "20"
      obj.user_name = this.username
    }
      obj.action = action
      const dialogRef = this.dialog.open(DialogAddClusterView, {
        data: obj});

      dialogRef.afterClosed().subscribe(result => {
        //TODO define data for Cluster
        if (result.event == 'Add') {
          //this.addCluster(result.data)
          this.userService.addCluster(result.data).subscribe((userServiceResponse: any) => {
              this.notifyService.notify(Type.success, 'Cluster added successfully!')
                this.redirectTo('/control')
                if (userServiceResponse != NONE_TYPE) {
                // TODO: We need to pass the system_manager_URL as well
                const my_data = {pairing_key: userServiceResponse.pairing_key, username: this.username, cluster_name: result.data.cluster_name}
                const dialogKey = this.dialog.open(DialogGenerateTokenView,
                  {
                    data: my_data,
                    height: "40%",
                    width: '50%'
                  });
                dialogKey.afterClosed().subscribe(() =>
                    this.showClusters()
                )
              }
              // this.surveyService.resetSurvey() => only for survey
            },
            (error => this.notifyService.notify(Type.error, error))
          )
        }
      })
  }

  openDialogApp(action: string, obj: any) {
    if (action == 'Add') {
      obj._id = {$oid: ""} // Only for the view, is then defined in the database
      obj.application_name = ""
      obj.application_namespace = ""
      obj.application_desc = ""
      obj.userId = this.userID
    }

    obj.action = action
    const dialogRef = this.dialog.open(DialogAddApplicationView, {data: obj})

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addApplication(result.data)
      } else if (result.event == 'Update') {
        console.log(result.data.applications[0])
        this.updateApplication(result.data.applications[0])
      } else if (result.event == 'Delete') {
        this.deleteApplication(result.data)
      }
    });
  }

  deleteApplication(app: any): void {
    this.api.getServicesOfApplication(app._id.$oid).subscribe((services: any) => {
      for (let j of services) {
        this.api.deleteService(j)
      }
    })

    this.api.deleteApplication(app).subscribe((_success) => {
        this.notifyService.notify(Type.success, 'Application "' + app.application_name + '" deleted successfully!')
        this.loadDataApplication();
      },
      (_error) => {
        this.notifyService.notify(Type.error, 'Error: Deleting application "' + app.application_name + '" failed!')
      })
  }

  addApplication(app: any): void {
    this.api.addApplication(app).subscribe((_success) => {
        this.loadDataApplication()
      },
      (_error: any) => {
        this.notifyService.notify(Type.error, 'Error: Adding application "' + app.application_name + '" failed!')
      })
  }

  updateApplication(app: any): void {
    this.api.updateApplication(app).subscribe((_success) => {
        this.notifyService.notify(Type.success, 'Application "' + app.application_name + '" updated successfully!')
        this.loadDataApplication();
      },
      (_error) => {
        this.notifyService.notify(Type.error, 'Error: Updating application "' + app.application_name + '" failed!')
      })
  }

  is_pairing_complete(cluster: any) {
    return cluster.pairing_complete
  }

  deleteCluster(cluster: any) {
    let data = {
      "text": "Delete cluster: " + cluster.cluster_name,
      "type": "cluster"
    }
    const dialogRef = this.dialog.open(DialogConfirmation, {data: data})
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == true) {
        this.api.deleteCluster(cluster).subscribe(() => {
          this.notifyService.notify(Type.success, "Cluster " + cluster.cluster_name + " deleted successfully!")
          this.redirectTo('/control')
          },
        (_error: any) => {
          this.notifyService.notify(Type.error, 'Error: Deleting cluster ' + cluster.cluster_name)
        })
      }
    });
  }

  handleChange() {
    this.api.getAppById(this.active.$oid).subscribe(app => {
        this.sharedService.selectApplication(app)
        this.clustersSelected = false
        this.appSelected = true
        this.router.navigate(['/control'])
      }
    );
  }

  showClusters() {
    this.appSelected = false
    this.settings = false
    this.clustersSelected = true
  }

  resetDashboard() {
    this.appSelected = this.settings = this.clustersSelected = false
  }

  onToolbarToggle() {
    this.opened = !this.opened
  }

  show() {
    this.appSelected = true
  }

  logout() {
    // this.api.logoutSurvey(this.username)
    this.authService.clear()
    this.userService.logout()
  }
}


