import {Component, OnInit} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {DialogConnectionSettings} from "../dialogs/dialogConnectionSettings";
import {MatDialog} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'deploy-form',
  templateUrl: './deploy-form.component.html',
  styleUrls: ['./deploy-form.component.css']
})
export class DeployFormComponent implements OnInit {

  jsonContent: string = "";
  form: FormGroup;
  fileArrayForm = new FormArray([]);
  canViewLatConstrains: boolean[] = [];
  connectivityList: number[] = [];
  conConstrainsArray: FormArray[] = [new FormArray([new FormGroup({
    'type': new FormControl(0),
    'threshold': new FormControl(0),
    'rigidness': new FormControl(0),
    'convergence_time': new FormControl(0),
  })])];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private route: ActivatedRoute) {
    console.log("Servus die Wadel");
    this.form = fb.group({
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
    this.route.paramMap.subscribe(pram => {
      console.log(pram.get("id"));
    })
    this.createEditFormGroup();
  }

  createEditFormGroup(): void {
    // TODO load the service from the Database
    const service =
      {
        "microservice_name": "1",
        "virtualization": "container",
        "memory": 1,
        "vcpus": 1,
        "vgpus": 1,
        "vtpus": 1,
        "bandwidth_in": 1,
        "bandwidth_out": 1,
        "storage": 1,
        "code": "1",
        "state": "1",
        "port": 1,
        "addresses":
          {
            "rr_ip": "1",
            "closest_ip": "1",
            "instances": "1"
          },
        "added_files": [],
        "constraints": [
          {
            "type": "latency",
            "area": "munich2",
            "threshold": 1,
            "rigidness": 1,
            "convergence_time": 1
          }
        ],
        "connectivity": [
          {
            "target_microservice_id": "ID1",
            "con_constraints": [
              {
                "type": "geo",
                "threshold": 1,
                "rigidness": 1,
                "convergence_time": 1
              }
            ]
          }
        ],
        "args": null
      }

    let constraintsNumber = service.constraints.length;
    for (let i = 0; i < constraintsNumber; i++) {
      this.addConstrains();
    }

    let connectivityNumber = service.connectivity.length;
    for (let i = 0; i < connectivityNumber; i++) {
      this.addConnectivity();
      //this.addConConstrains(i);
    }

    let fileNumber = service.added_files.length;
    for (let i = 0; i < fileNumber; i++) {
      this.addFileInput();
    }

    this.form.patchValue(service)
  }

  // For the constraints Radio Button
  onRadioChange(event: MatRadioChange, index: number) {
    this.canViewLatConstrains![index] = event.value == "latency";
  }

  // Add connectivity's between Services
  addConnectivity() {
    //this.connectivityList.push(this.connectivityList.length);

    this.conConstrainsArray.push(new FormArray([]));
    let n = this.connectivity.length;

    this.connectivity.push(new FormGroup({
      'target_microservice_id': new FormControl(),
      'con_constraints': this.conConstrainsArray[n],
    }));

  }

  //TODO Fix this
  deleteConnection(obj: number) {
    let index = this.connectivityList.indexOf(obj);
    this.connectivityList.splice(index, 1);
  }

  // TODO what should be done is the input is lat and longitude?
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

    const dialogRef = this.dialog.open(DialogConnectionSettings, {
      data
    });

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

  //
  // addConConstrains(index: number) {
  //   this.conConstrainsArray[index].push(new FormGroup({
  //     'type': new FormControl(),
  //     'threshold': new FormControl(),
  //     'rigidness': new FormControl(),
  //     'convergence_time': new FormControl(),
  //   }));
  //}

  get constraints() {
    return this.form.get("constraints") as FormArray
  }

  get connectivity() {
    return this.form.get("connectivity") as FormArray;
  }

  onSubmit() {
    console.log("Submitted");
    console.log(this.form.value);
    this.jsonContent = this.form.value;
  }
}
