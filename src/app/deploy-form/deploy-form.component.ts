import {Component, OnInit} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {DialogConnectionSettings} from "../dialogs/dialogConnectionSettings";
import {MatDialog} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DbClientService} from "../services/db-client.service";

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

  allJobs$: any // For the Dropdown list of the connections

  jsonContent = "load later here the correct sla";

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
              private router: Router) {

    this.currentJobID = "not yet defined";

    this.form = fb.group({
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
        'instances': []
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

    if (this.service.constraints != undefined) {
      let constraintsNumber = this.service.constraints.length;
      for (let i = 0; i < constraintsNumber; i++) {
        this.addConstrains();
      }
    }

    if (this.service.connectivity != undefined) {
      let connectivityNumber = this.service.connectivity.length;
      for (let i = 0; i < connectivityNumber; i++) {
        this.addConnectivity();
      }
    }

    if (this.service.added_files != undefined) {
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

  onSubmit() {
    if (this.editingJob) {
      this.dbService.updateJob(this.currentJobID, this.form.value);
    } else {
      this.dbService.addJob(this.form.value);
    }
    this.router.navigate(['/']);
  }
}
