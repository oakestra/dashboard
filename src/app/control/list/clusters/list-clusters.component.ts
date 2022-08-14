import {Component} from '@angular/core';
import {ApiService} from "../../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../../shared/modules/notification/notification.service";
import {UserService} from "../../../shared/modules/auth/user.service";

@Component({
  selector: 'dev-home',
  templateUrl: 'list-clusters.component.html',
  styleUrls: ['./list-clusters.component.css']
})

export class ListClustersComponent{
  clusters: any
  userID: string | null
  username: any

  constructor (private api: ApiService,
               private notifyService: NotificationService,
               public userService: UserService){
    this.userID = ""
  }

  ngOnInit(): void {
    this.username = this.userService.getUsername()
    this.api.getUserByName(this.username).subscribe((data: any) => {
      this.userID = data._id.$oid;
    })
    this.loadData()
  }

  loadData(){
    this.api.getClustersOfUser(this.userID).subscribe((result: any) => {
      this.clusters = result
    },
    (_error: any) => {
      this.notifyService.notify(Type.error, 'Error: Getting clusters of ' + this.username)
    })
  }

  is_complete(current_cluster: any){
    return current_cluster.pairing_complete
  }
}
