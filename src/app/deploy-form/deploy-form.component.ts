import {Component} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {DialogConnectionSettings} from "../dialogs/dialogConnectionSettings";
import {MatDialog} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'deploy-form',
  templateUrl: './deploy-form.component.html',
  styleUrls: ['./deploy-form.component.css']
})
export class DeployFormComponent {

  jsonContent: string = "";
  form: FormGroup;
  fileArrayForm = new FormArray([]);

  canViewLatConstrains: boolean[] = [];

  connectivityList: number[] = [];
  conConstrainsArray = new FormArray([]);

  dialogDataArray: any[] = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder) {
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

  // For the constraints Radio Button
  onRadioChange(event: MatRadioChange, index: number) {
    this.canViewLatConstrains![index] = event.value == "latency";
  }

  // Add connectivity's between Services
  addConnectivity() {
    this.connectivityList.push(this.connectivityList.length);
    this.connectivity.push(new FormGroup({
      'target_microservice_id': new FormControl(),
      'con_constraints': this.conConstrainsArray,
    }));

    this.dialogDataArray.push({
      type: "",
      threshold: 0,
      rigidness: 0,
      convergence_time: 0
    })
  }

  //TODO Fix this
  deleteConnection(obj: number) {
    let index = this.connectivityList.indexOf(obj);
    this.connectivityList.splice(index, 1);
  }

  // TODO what should be done is the input is lat and longitude?
  addConstrains() {
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
    let data = this.dialogDataArray[index];
    const dialogRef = this.dialog.open(DialogConnectionSettings, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.saveDialogData(result, index);
      data = result;
    });
  }

  // Saving the Dialog Data to the Array and the Form
  //TODO rethink about this, maybe additional dialogDataArray is not needed
  saveDialogData(data: any, index: number) {
    this.dialogDataArray[index] = {
      type: data.type,
      threshold: data.threshold,
      rigidness: data.rigidness,
      convergence_time: data.convergence_time
    };

    this.conConstrainsArray.push(new FormGroup({
      'type': new FormControl(data.type),
      'threshold': new FormControl(data.threshold),
      'rigidness': new FormControl(data.rigidness),
      'convergence_time': new FormControl(data.convergence_time),
    }));
  }

  get constraints() {
    return this.form.get("constraints") as FormArray
  }

  get connectivity() {
    return this.form.get("connectivity") as FormArray
  }

  onSubmit() {
    console.log("Submitted");
    console.log(this.form.value);
    this.jsonContent = this.form.value;
  }
}
