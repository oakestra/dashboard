import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogServiceStatusView} from "../dialogs/service-status/dialogServiceStatus";
import {Subscription} from "rxjs/internal/Subscription";
import {DialogConfirmation} from "../dialogs/confirmation/dialogConfirmation";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit, OnDestroy {

  services: any;
  servicesCount = 0;
  appName: string = ""
  appID: string = ""

  clusterName: string = ""
  clusterID: string = ""
  cluster_info: any;

  is_app: boolean = true

  subscriptions: Subscription[] = []

  constructor(public sharedService: SharedIDService,
              private api: ApiService,
              public dialog: MatDialog,
              private router: Router,
              private notifyService: NotificationService){
  }

  ngOnInit(): void {

    let sub2 = this.sharedService.clusterObserver$.subscribe(
        x => {
          this.cluster_info = x
          this.clusterName = x.cluster_name
          this.clusterID = x._id.$oid
          this.is_app = false
        });
    this.subscriptions.push(sub2)

    let sub = this.sharedService.applicationObserver$.subscribe(
      x => {
        this.appName = x.application_name
        this.appID = x._id.$oid
        this.is_app = true
        this.loadData()
      });
    this.subscriptions.push(sub)

  }

  ngOnDestroy() {
    for (let s of this.subscriptions) {
      s.unsubscribe()
    }
  }

  loadData(): void {
    let sub = this.api.getServicesOfApplication(this.appID).subscribe((services: any) => {
      this.services = services
      this.servicesCount = services.length
      console.log(services)
    }, (err) => {
      console.log(err)
    })
    this.subscriptions.push(sub)
  }

  deleteService(service: any) {
    this.api.deleteService(service).subscribe(() => {
      this.loadData()
    })
  }

  deleteInstance(service:any , instance: any){
    this.api.deleteInstance(service, instance).subscribe(() => {
      this.loadData()
    })
  }

  deployService(service: any) {
    this.api.deployService(service).subscribe(() => {
      this.loadData()
    })
  }

  deleteServiceWithGraph(id: string) {
    let service = {_id: {$oid: id}}
    this.api.deleteService(service).subscribe(() => {
      this.loadData()
    })
  }

  // repeated function in navbar.component.ts
  deleteCluster(cluster: any) {
    let data = {
      "text": "Delete cluster: " + cluster.cluster_name,
      "type": "cluster"
    }
    const dialogRef = this.dialog.open(DialogConfirmation, {data: data})
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == true) {
        this.api.deleteCluster(cluster._id.$oid).subscribe(() => {
              this.notifyService.notify(Type.success, "Cluster " + cluster.cluster_name + " deleted successfully!")
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                  this.router.navigate(['/control']));
            },
            (_error: any) => {
              this.notifyService.notify(Type.error, 'Error: Deleting cluster ' + cluster.cluster_name)
            })
      }
    });
  }

  openStatusDialog(service: any) {
    const dialogRef = this.dialog.open(DialogServiceStatusView, {data: service});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  deployAllServices() {
    for (let j of this.services) {
      this.deployService(j)
    }
  }

  private setting = {
    element: {
      dynamicDownload: null as any
    }
  }

  downloadConfig(service: any) {
    if(service._id)
      delete service._id
    let fileName = service.microservice_name + ".json"
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(JSON.stringify(service))}`);
    element.setAttribute('download', fileName);

    let event = new MouseEvent("click");
    element.dispatchEvent(event);
  }
}
