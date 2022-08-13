import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-generate-token.html',
  styleUrls: ['./dialog-generate-token.css']
})

export class DialogGenerateTokenView {

  key = new FormControl();
  cluster_name = "";
  username = "";

  constructor (public dialogRef: MatDialogRef<DialogGenerateTokenView>,
               @Inject(MAT_DIALOG_DATA) public data: any){

    this.key.setValue(data.pairing_key)
    this.cluster_name = data.cluster_name
    this.username = data.username
  }

  copyPairingKey(key: any){
    key.select();
    document.execCommand('copy');
    key.setSelectionRange(0, 0);
  }

  download(filename: any, text: any) {
    // TODO: Fix SYSTEM_MANAGER_URL (now it is undefined)
    let new_text = `CLUSTER_NAME=${this.cluster_name}
    SYSTEM_MANAGER_URL=${process.env.API_ADDRESS}
    USER_NAME=${this.username}
    CLUSTER_PAIRING_KEY='${text}'`

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new_text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
