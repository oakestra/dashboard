import {Component, OnInit} from "@angular/core";
import {UserEntity, UserRole} from "../../landingpage/login/login.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../shared/modules/api/data.service";
import {FormControl} from "@angular/forms";
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditUserView} from "../dialogs/dialogEditUser";
import {DatePipe} from "@angular/common";

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'created_at', 'roles', 'symbol'];

  users: Array<UserEntity> = [];
  searchedUsers: Array<UserEntity> = [];

  selectedUser: any;
  action: string = "";

  searchText = '';

  roles: UserRole[] = [];

  selectedItems = [""];

  dropdown = new FormControl();
  dropdownList: string[] = [];


  // TODO use only one API
  constructor(private api: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private dbService: DbClientService,
              private dialog: MatDialog,
              private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.api.getRoles().subscribe(
      (data: any) => {
        this.roles = data.roles;
        this.roles.forEach((role) => {
          this.dropdownList.push(role.name)
        })
        //this.roles.forEach((role) => this.dropdownList.push({"id": role.role_id, "itemName": role.name}))
        this.loadData();
      }
    )
  }

  loadData(): void {
    this.dbService.getAllUser().subscribe((users: any) => {
      //this.users = this.utilService.format_date(users, 'created_at', null);

      this.users = users;
      this.route.queryParams.subscribe(params => {
        // TODO Implement filter later
        const username = params['username'];
        this.action = params['action'];
        this.searchText = params['searchText']
        this.selectedItems = [];

        if (params['searchRoles']) {
          let searchRoles = [];
          if (Array.isArray(params['searchRoles'])) {
            searchRoles = params['searchRoles'];
          } else {
            searchRoles.push(params['searchRoles']);
          }
          searchRoles.forEach((searched) => {
            const found = this.dropdownList.find((role) => role === searched)!;
            this.selectedItems.push(found);
          })
        }

        // TODO Was soll das warum steht das hier?
        if (this.action === 'edit' && username) {
          this.selectedUser = this.users.find(user => user.name === username);
        } else if (this.action === 'add') {
          //this.selectedUser = this.entity.create_user_entity();
        } else {
          //this.action = null;
          this.selectedUser = null;
        }
        this.doFilter();
      });
    });
  }

  createUser() {
    this.router.navigate(['control', 'users'], {
      queryParams: {username: '', action: 'add'},
      queryParamsHandling: "merge"
    });
  }

  search(): void {
    const queryParams: { searchText: string, searchRoles: any } = {searchText: '', searchRoles: []};
    if (this.searchText && this.searchText.length > 0) {
      queryParams.searchText = this.searchText;
    }
    if (this.selectedItems) {
      this.selectedItems.forEach((role: any) => {
        queryParams.searchRoles.push(role.name)
      });
    }
    this.router.navigate(['control', 'users'], {queryParams: queryParams, queryParamsHandling: "merge"});
  }

  doFilter(): void {
    this.searchedUsers = this.users.filter((user) => this.nameFilter(user) && this.roleFilter(user));
  }

  nameFilter(user: UserEntity): boolean {
    return !this.searchText || this.searchText.length === 0 || user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
  }

  roleFilter(user: UserEntity): boolean {
    return !this.selectedItems || this.selectedItems.length === 0 || this.selectedItems.some((searchedRole: any) => {
      return (searchedRole.itemName === 'None' && user.roles.length === 0)
        || user.roles.some((role) => role.name === searchedRole.itemName)
    })
  }

  deleteUser(user: UserEntity): void {

    this.dbService.deleteUser(user).subscribe(() => {
        //this.notify.success("User " + user.name + " deleted successfully!");
        this.loadData();
      },
      (error: Error) => {
        //this.notify.success("Error: Deleting user " + user.name + " failed!");
      })
  }

  openDialog(action: string, obj: any) {


    if (action == "add") {
      obj = { // New UserEntity
        created_at: "", email: "", name: "", password: "", roles: []
      };
    }

    let data = {
      "obj": obj,
      "action": action,
    }
    const dialogRef = this.dialog.open(DialogEditUserView, {data: data});

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'add') {
        console.log(result.data)
        this.addUser(result.data)
      } else if (result.event == 'edit') {

      }
    });
  }

  addUser(user: UserEntity) {
    console.log(user.name)
    if (user.name.length !== 0 && user.password.length !== 0) {
      user.created_at = this.datePipe.transform((new Date), 'dd/MM/yyyy HH:mm')!;
      this.dbService.registerUser(user).subscribe(
        (result: any) => {
          //this.notify.success("Success", "You are registered successfully.");
          this.loadData()
        }, error1 => {
          if (!error1.hasOwnProperty("_body")) {
            //this.notify.error("Error", "Server is not running.");
          }
        }
      )
    } else {
      //this.notify.error("Error", "Please provide valid inputs for login.");
    }
  }
}
