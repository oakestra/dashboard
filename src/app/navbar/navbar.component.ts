import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/dialogAddApplication";
import {Application} from "../objects/application";
import {SharedIDService} from "../services/shared-id.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  applicationList: {
    id: number,
    name: string,
    description: string
  } [] = [{id:12345,name:  "Default",description:  "All Services with are not in a Application are in the Default Application"}]

  active: number;

  constructor(private observer: BreakpointObserver, public dialog: MatDialog, private sharedService: SharedIDService) {
    sharedService.sharedNode = this.applicationList[0];
    this.active = this.applicationList[0].id;
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

  //dialog = new DialogAddApplication();
  openDialog(action: string, obj: any) {
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
    this.applicationList.push(new Application(this.applicationList.length, data.name, data.description));
  }

  updateApplication(data: any) {
    let tmp = this.applicationList.find(item => item.id == data.id)!;
    tmp.name = data.name;
    tmp.description = data.description;
  }

  deleteApplication(data: any) {
    let tmp = this.applicationList.find(item => item.id == data.id)!;
    let index = this.applicationList.indexOf(tmp);
    this.applicationList.splice(index, 1);
  }

  ngOnInit(): void {
  }

  getApplicationByID(id:number): Application{
      return this.applicationList.find(item => item.id == id)!;
  }


  handleChange() {
    this.sharedService.sharedNode = this.getApplicationByID(this.active!);
    console.log(this.active);
  }
}
