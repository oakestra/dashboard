import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogServiceStatusView} from "../dialogs/service-status/dialogServiceStatus";
import {Subscription} from "rxjs/internal/Subscription";

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
  subscriptions: Subscription[] = []

  constructor(public sharedService: SharedIDService,
              private api: ApiService,
              public dialog: MatDialog){
  }

  ngOnInit(): void {
    let sub = this.sharedService.applicationObserver$.subscribe(
      x => {
        this.appName = x.name
        this.appID = x._id.$oid
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
