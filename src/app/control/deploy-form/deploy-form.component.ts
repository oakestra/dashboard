import {Component, OnInit} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {DialogConnectionSettings} from "../dialogs/dialogConnectionSettings";
import {MatDialog} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {Subscription} from "rxjs";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";

@Component({
  selector: 'deploy-form',
  templateUrl: './deploy-form.component.html',
  styleUrls: ['./deploy-form.component.css']
})

export class DeployFormComponent implements OnInit {

  form: FormGroup;

  fileArrayForm = new FormArray([]);
  canViewLatConstrains: boolean[] = [];

  job$: any;
  service: any = null;

  editingJob: boolean = false;
  currentJobID: string = ""; // This one is uses to get the Job from the DB

  applicationId: string = "";

  allJobs$: any // For the Dropdown list of the connections

  jsonContent = "load later here the correct sla";

  requiredFileType: string = "txt";

  fileName = '';
  uploadProgress: number = 0;
  uploadSub: Subscription = new Subscription;
  fileToUpload: File | null = null;

  conConstrainsArray: FormArray[] = [new FormArray([new FormGroup({
    'type': new FormControl(0),
    'threshold': new FormControl(0),
    'rigidness': new FormControl(0),
    'convergence_time': new FormControl(0),
  })])];

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private dbService: DbClientService,
              private router: Router,
              private shardService: SharedIDService) {

    this.currentJobID = "not yet defined";

    this.shardService.applicationObservable$.subscribe(obs => {
      obs.subscribe((app: any) => this.applicationId = app._id.$oid)
    })

    this.form = fb.group({
      'applicationId': [],
      'microserviceID': [],
      'microservice_name': [],
      'virtualization': [],
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
      'args': []
    });
  }

  ngOnInit() {

    this.allJobs$ = this.dbService.allJobs

    this.route.paramMap.subscribe(pram => {
      if (pram.get("id") != null) {

        this.editingJob = true;
        this.currentJobID = pram.get("id")!; // Set the id to the id in the URL
        this.form.get("microserviceID")?.setValue(this.currentJobID);
        this.job$ = this.dbService.getJobByID(this.currentJobID);

        this.job$.subscribe((data: any) => {
          console.log(data)
          this.service = data.job_sla;
          console.log(this.service);
          this.createEditFormGroup();
        });

      } else {
        // new job is configured
        this.service = true;
      }
    })
  }

  createEditFormGroup(): void {

    if (!this.service.constraints.empty) {
      let constraintsNumber = this.service.constraints.length;
      for (let i = 0; i < constraintsNumber; i++) {
        this.addConstrains();
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

  // For the constraints Radio Button
  onRadioChange(event: MatRadioChange, index: number) {
    this.canViewLatConstrains![index] = event.value == "latency";
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
    this.connectivity.controls.splice(index, 1)
    this.connectivity.removeAt(index)
  }

  // TODO what should be done if the input is lat and longitude?
  addConstrains() {

    this.conConstrainsArray.push(new FormArray([new FormGroup({
        'type': new FormControl(0),
        'threshold': new FormControl(0),
        'rigidness': new FormControl(0),
        'convergence_time': new FormControl(0),
      })])
    )

    this.constraints.push(new FormGroup({
      'type': new FormControl(),
      'area': new FormControl(),
      'threshold': new FormControl(),
      'rigidness': new FormControl(),
      'convergence_time': new FormControl(),
    }));

    this.canViewLatConstrains?.push(true);
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

    // For now clear the Array, ask Max if multiple entry's are necessary
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



  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
  }


  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);

      const path = this.dbService.fileUpload(formData)

      path.subscribe((x: any) => {
        this.fileArrayForm.controls[index] = new FormControl([x.path])
      })
      console.log(this.fileArrayForm.controls)

      // this.uploadSub = upload$.subscribe(event => {
      //   if (event.type == HttpEventType.UploadProgress) {
      //     this.uploadProgress = Math.round(100 * (event.loaded / event.total!));
      //   }
      // })
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    //this.uploadSub = null;
  }

  onSubmit() {
    let content = this.form.value
    content.applicationId = this.applicationId
    console.log(this.applicationId)
    console.log(this.form.value)

    if (this.editingJob) {
      console.log(content)
      this.dbService.updateJob(this.currentJobID, content);
    } else {
      this.dbService.addJob(content);
    }
    this.router.navigate(['/control']);
  }
}
