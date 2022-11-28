import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogConnectionSettingsView } from '../dialogs/content-connection/dialog-connection-settings-view.component';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/modules/api/api.service';
import { SharedIDService } from '../../shared/modules/helper/shared-id.service';
import { CleanJsonService } from '../../shared/util/clean-json.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { NotificationService, Type } from '../../shared/modules/notification/notification.service';
import { IApplication } from '../../root/interfaces/application';
import { IService } from '../../root/interfaces/service';

@Component({
  selector: 'deploy-form',
  templateUrl: './deploy-form.component.html',
  styleUrls: ['./deploy-form.component.css'],
})
//TODO Refactor this Component and split it up to multiple small components
export class DeployFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  file: File | undefined;
  filename = 'Select File to Upload';
  fileArrayForm = new FormArray([]);
  canViewLatConstrains: boolean[] = [];
  service: any = null;
  editingService = false; // True if the user is editing the service
  currentServiceID = ''; // This one is uses to get the service from the DB
  applicationId = '';
  currentApplication: IApplication;
  argsArray: string[] = [];
  argsText = '';
  allServices: any; // For the Dropdown list of the connections
  jsonContent: any; // The final SLA witch is generated form the form
  subscriptions: Subscription[] = [];
  formInvalid = false;

  conConstrainsArray: FormArray[] = [
    new FormArray([
      new FormGroup({
        type: new FormControl(0),
        threshold: new FormControl(0),
        rigidness: new FormControl(0),
        convergence_time: new FormControl(0),
      }),
    ]),
  ];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private shardService: SharedIDService,
    private notifyService: NotificationService,
  ) {
    this.currentServiceID = 'not yet defined';
    const sub = this.shardService.applicationObserver$.subscribe((app) => {
      this.currentApplication = app;
      this.applicationId = app._id.$oid;
      const s = this.api
        .getServicesOfApplication(this.applicationId)
        .pipe(take(1))
        .subscribe({
          next: (services: IService[]) => {
            this.allServices = services.filter((s: IService) => s._id?.$oid !== this.currentServiceID);
          },
          error: (err) => {
            console.log(err);
          },
        });
      this.subscriptions.push(s);
    });
    this.subscriptions.push(sub);

    this.form = fb.group({
      microserviceID: [],
      microservice_name: ['Default_Service'],
      microservice_namespace: ['test'],
      virtualization: ['container'],
      description: ['This is a default service'],
      memory: [50],
      vcpus: [1],
      vgpus: [0],
      vtpus: [0],
      bandwidth_in: [0],
      bandwidth_out: [0],
      storage: [0],
      code: ['URL to code'],
      state: ['URL to state'],
      port: ['80'],
      addresses: fb.group({
        rr_ip: [],
        closest_ip: [],
        instances: fb.group({
          from: [],
          to: [],
          start: [],
        }),
      }),
      added_files: this.fileArrayForm,
      constraints: new FormArray([]),
      connectivity: new FormArray([]),
      args: this.argsArray,
      status: 'CREATED',
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((pram) => {
      if (pram.get('id') !== null) {
        this.editingService = true;
        this.currentServiceID = pram.get('id')!; // Set the id to the id in the URL

        this.api.getServiceByID(this.currentServiceID).subscribe((service: IService) => {
          this.service = service;
          this.createEditFormGroup();
        });
      } else {
        // user configures a new service
        this.service = true;
      }
    });
  }

  ngOnDestroy() {
    for (const s of this.subscriptions) {
      s.unsubscribe();
    }
  }

  createEditFormGroup(): void {
    if (!this.service.constraints.empty) {
      const constraintsNumber = this.service.constraints.length;
      for (let i = 0; i < constraintsNumber; i++) {
        this.addConstrains(this.service.constraints[i].type);
      }
    }

    if (!this.service.connectivity.empty) {
      const connectivityNumber = this.service.connectivity.length;
      for (let i = 0; i < connectivityNumber; i++) {
        this.addConnectivity();
      }
    }

    if (!this.service.added_files.empty) {
      const fileNumber = this.service.added_files.length;
      for (let i = 0; i < fileNumber; i++) {
        this.addFileInput();
      }
    }
    this.form.patchValue(this.service);
  }

  // Add connectivity's between Services
  addConnectivity() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // TODO find better solution
    this.conConstrainsArray.push(new FormArray([]));
    const n = this.connectivity.length;

    this.connectivity.push(
      new FormGroup({
        target_microservice_id: new FormControl(),
        con_constraints: this.conConstrainsArray[n],
      }),
    );
  }

  deleteConnection(index: number) {
    this.connectivity.removeAt(index);
  }

  deleteFiles(index: number) {
    this.fileArrayForm.controls.splice(index, 1);
  }

  deleteConstrains(index: number) {
    this.constraints.controls.splice(index, 1);
    this.canViewLatConstrains.splice(index, 1);
  }

  addConstrains(type: string) {
    if (type == 'geo') {
      this.constraints.push(
        new FormGroup({
          type: new FormControl(['geo']),
          location: new FormControl(),
          threshold: new FormControl(),
          rigidness: new FormControl(),
          convergence_time: new FormControl(),
        }),
      );
      this.canViewLatConstrains?.push(false);
    } else {
      this.constraints.push(
        new FormGroup({
          type: new FormControl(['latency']),
          area: new FormControl(),
          threshold: new FormControl(),
          rigidness: new FormControl(),
          convergence_time: new FormControl(),
        }),
      );
      this.canViewLatConstrains?.push(true);
    }
  }

  addFileInput() {
    //TODO Fix this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.fileArrayForm.push(new FormControl());
  }

  // Dialog for the connection settings
  openDialog(index: number) {
    let data = this.conConstrainsArray[index].value[0];
    const dialogRef = this.dialog.open(DialogConnectionSettingsView, { data });

    dialogRef.afterClosed().subscribe((result) => {
      this.saveDialogData(result, index);
      data = result;
    });
  }

  // Saving the Dialog Data to the Array and the Form
  saveDialogData(data: any, index: number) {
    this.conConstrainsArray[index].clear();
    if (this.conConstrainsArray[index].length == 0) {
      this.conConstrainsArray[index].push(
        new FormGroup({
          type: new FormControl(data.type),
          threshold: new FormControl(data.threshold),
          rigidness: new FormControl(data.rigidness),
          convergence_time: new FormControl(data.convergence_time),
        }),
      );
    }
  }

  get constraints() {
    return this.form.get('constraints') as FormArray;
  }

  get connectivity() {
    return this.form.get('connectivity') as FormArray;
  }

  onFileSelected(event: any, index: number, action: string) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const path = this.api.fileUpload(formData);
      let fc;
      path.subscribe({
        next: (x: any) => {
          if (action == 'file') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // TODO fix
            this.fileArrayForm.controls[index] = new FormControl([x.path]);
          } else if (action == 'code') {
            fc = this.form.get('code') as FormControl;
            fc.setValue([x.path]);
          } else if (action == 'state') {
            fc = this.form.get('state') as FormControl;
            fc.setValue([x.path]);
          }
        },
        error: () => {
          this.notifyService.notify(Type.error, 'File not supported');
        },
      });
    }
  }

  loadFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
    this.filename = this.file!.name;
  }

  uploadDocument() {
    if (this.file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const sla = JSON.parse(fileReader.result + '');
        sla.applicationID = this.applicationId;
        sla._id = null;
        if (sla.job_name) {
          delete sla.job_name;
        }
        this.generateSLA(sla);
        this.addService();
      };
      fileReader.readAsText(this.file);
    }
  }

  generateSLA(sla: any) {
    this.jsonContent = {
      api_version: 'v2.0',
      sla_version: 'v2.0',
      customerID: this.shardService.userID,
      applications: [
        {
          applicationID: this.currentApplication._id.$oid,
          application_name: this.currentApplication.application_name,
          application_namespace: this.currentApplication.application_namespace,
          application_desc: this.currentApplication.application_desc,
          microservices: [{}],
        },
      ],
      args: [],
    };

    // Is set in de mongodb
    sla.microserviceID = '';
    this.jsonContent.applications[0].microservices = [sla];
    this.jsonContent = CleanJsonService.cleanData(this.jsonContent);
  }

  addService() {
    this.api.addService(this.jsonContent).subscribe({
      next: () => {
        this.router.navigate(['/control']).then();
        this.notifyService.notify(Type.success, 'Service generation was successful');
      },
      error: () => this.notifyService.notify(Type.error, 'File was not in the correct format'),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.formInvalid = true;
      return;
    }

    const content = this.form.value;
    content.applicationID = this.applicationId;
    content.args = [this.argsText];

    if (this.editingService) {
      // content.microserviceID = this.currentServiceID
      this.generateSLA(content);
      this.jsonContent.applications[0].microservices[0].microserviceID = this.currentServiceID;
      this.api.updateService(this.jsonContent, this.currentServiceID).subscribe({
        next: () => {
          this.router.navigate(['/control']).then();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.generateSLA(content);
      this.addService();
    }
  }
}
