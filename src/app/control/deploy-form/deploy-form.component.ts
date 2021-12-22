import {Component, OnInit} from '@angular/core';
import {DialogConnectionSettings} from "../dialogs/content-connection/dialogConnectionSettings";
import {MatDialog} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../shared/modules/api/api.service";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {CleanJsonService} from "../../shared/util/clean-json.service";

@Component({
  selector: 'deploy-form',
  templateUrl: './deploy-form.component.html',
  styleUrls: ['./deploy-form.component.css']
})

export class DeployFormComponent implements OnInit {

  form: FormGroup;

  file: File | undefined
  filename = "Select File to Upload"

  fileArrayForm = new FormArray([]);
  canViewLatConstrains: boolean[] = [];

  service: any = null;

  editingJob: boolean = false; // True if the user is editing the job
  currentJobID = ""; // This one is uses to get the Job from the DB
  applicationId = "";
  currentApplication: any;

  argsArray: string[] = [];
  argsText = "";

  allJobs: any // For the Dropdown list of the connections

  jsonContent: any // The final SLA witch is generated form the form

  conConstrainsArray: FormArray[] = [new FormArray([new FormGroup({
    'type': new FormControl(0),
    'threshold': new FormControl(0),
    'rigidness': new FormControl(0),
    'convergence_time': new FormControl(0),
  })])];

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private api: ApiService,
              private router: Router,
              private shardService: SharedIDService) {

    this.currentJobID = "not yet defined";
    this.shardService.applicationObservable$.subscribe(app => {
      this.currentApplication = app
      this.applicationId = app._id.$oid
      this.api.getJobsOfApplication(this.applicationId).subscribe((jobs: any) => {
        this.allJobs = jobs
      }, (err) => {
        console.log(err)
      })
    })

    this.form = fb.group({
      'microserviceID': [],
      'microservice_name': [],
      'microservice_namespace': [],
      'virtualization': [],
      'description': [],
      'memory': [],
      'vcpus': [],
      'vgpus': [],
      'vtpus': [],
      'bandwidth_in': [],
      'bandwidth_out': [],
      'storage': [],
      'code': [],
      'state': [],
      'port': [],
      'addresses': fb.group({
        'rr_ip': [],
        'closest_ip': [],
        'instances': fb.group({
          'from': [],
          'to': [],
          'start': [],
        }),
      }),
      'added_files': this.fileArrayForm,
      'constraints': new FormArray([]),
      'connectivity': new FormArray([]),
      'args': this.argsArray
    });
  }

  ngOnInit() {

    this.route.paramMap.subscribe(pram => {
      if (pram.get("id") != null) {
        this.editingJob = true;
        this.currentJobID = pram.get("id")!; // Set the id to the id in the URL
        this.form.get("microserviceID")?.setValue(this.currentJobID);

        this.api.getJobByID(this.currentJobID).subscribe((job: any) => {
          this.service = job;
          this.createEditFormGroup();
        });
      } else {
        // user configures a new job
        this.service = true;
      }
    })
  }

  createEditFormGroup(): void {

    if (!this.service.constraints.empty) {
      let constraintsNumber = this.service.constraints.length;
      for (let i = 0; i < constraintsNumber; i++) {
        this.addConstrains(this.service.constraints[i].type);
      }
    }

    if (!this.service.connectivity.empty) {
      let connectivityNumber = this.service.connectivity.length;
      for (let i = 0; i < connectivityNumber; i++) {
        this.addConnectivity();
      }
    }

    if (!this.service.added_files.empty) {
      let fileNumber = this.service.added_files.length;
      for (let i = 0; i < fileNumber; i++) {
        this.addFileInput();
      }
    }
    this.form.patchValue(this.service)
  }

  // Add connectivity's between Services
  addConnectivity() {
    this.conConstrainsArray.push(new FormArray([]));
    let n = this.connectivity.length;

    this.connectivity.push(new FormGroup({
      'target_microservice_id': new FormControl(),
      'con_constraints': this.conConstrainsArray[n],
    }));
  }

  deleteConnection(index: number) {
    this.connectivity.removeAt(index)
  }

  deleteFiles(index: number) {
    this.fileArrayForm.controls.splice(index, 1)
  }

  deleteConstrains(index: number) {
    this.constraints.controls.splice(index, 1)
    this.canViewLatConstrains.splice(index, 1)
  }

  addConstrains(type: string) {

    if (type == "geo") {
      this.constraints.push(new FormGroup({
        'type': new FormControl(["geo"]),
        'location': new FormControl(),
        'threshold': new FormControl(),
        'rigidness': new FormControl(),
        'convergence_time': new FormControl(),
      }));
      this.canViewLatConstrains?.push(false);
    } else {
      this.constraints.push(new FormGroup({
        'type': new FormControl(["latency"]),
        'area': new FormControl(),
        'threshold': new FormControl(),
        'rigidness': new FormControl(),
        'convergence_time': new FormControl(),
      }));
      this.canViewLatConstrains?.push(true);
    }
  }

  addFileInput() {
    this.fileArrayForm.push(new FormControl(""));
  }

  // Dialog for the connection settings
  openDialog(index: number) {
    let data = this.conConstrainsArray[index].value[0];
    const dialogRef = this.dialog.open(DialogConnectionSettings, {data});

    dialogRef.afterClosed().subscribe(result => {
      this.saveDialogData(result, index);
      data = result;
    });
  }

  // Saving the Dialog Data to the Array and the Form
  saveDialogData(data: any, index: number) {
    this.conConstrainsArray[index].clear();
    if (this.conConstrainsArray[index].length == 0) {
      this.conConstrainsArray[index].push(new FormGroup({
        'type': new FormControl(data.type),
        'threshold': new FormControl(data.threshold),
        'rigidness': new FormControl(data.rigidness),
        'convergence_time': new FormControl(data.convergence_time),
      }));
    }
  }

  get constraints() {
    return this.form.get("constraints") as FormArray
  }

  get connectivity() {
    return this.form.get("connectivity") as FormArray;
  }

  onFileSelected(event: any, index: number, action: string) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const path = this.api.fileUpload(formData)
      let fc
      path.subscribe((x: any) => {
        if (action == "file") {
          this.fileArrayForm.controls[index] = new FormControl([x.path])
        } else if (action == "code") {
          fc = this.form.get("code") as FormControl
          fc.setValue([x.path])
        } else if (action == "state") {
          fc = this.form.get("state") as FormControl
          fc.setValue([x.path])
        }
      })
    }
  }

  loadFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
    this.filename = this.file!.name
  }

  uploadDocument() {
    if (this.file) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        console.log(fileReader.result);
        let sla = JSON.parse(fileReader.result + "")
        sla.applicationId = this.applicationId
        this.generateSLA(sla)
      }
      fileReader.readAsText(this.file);
    }
  }

  generateSLA(jobSLA: any) {

    this.jsonContent = {
      "api_version": "v0.3.0",
      "customerID": "10000000001xyz",
      "applications": [
        {
          "applicationID": this.currentApplication._id.$oid,
          "application_name": this.currentApplication.name,
          "application_namespace": this.currentApplication.namespace,
          "application_desc": this.currentApplication.description,
          "microservices": [{}]
        },
      ],
      "args": []
    }

    // Is set in de mongodb
    jobSLA.microserviceID = ""
    this.jsonContent.applications[0].microservices = [jobSLA]
    this.jsonContent = CleanJsonService.cleanData(this.jsonContent)

    this.api.addJob(this.jsonContent).subscribe((_e: any) => {
      this.router.navigate(['/control']);
    })
  }

  onSubmit() {
    let content = this.form.value
    content.applicationId = this.applicationId
    content.args = [this.argsText]

    if (this.editingJob) {
      content.microserviceID = {_id: {$oid: this.currentJobID}}
      this.api.updateJob(content).subscribe((_success) => {
          this.router.navigate(['/control']);
        },
        (err) => {
          console.log(err)
        });
    } else {
      this.generateSLA(content);
    }
  }
}
