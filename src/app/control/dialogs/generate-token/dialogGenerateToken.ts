import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-generate-token.html',
  styleUrls: ['./dialog-generate-token.css']
})

export class DialogGenerateTokenView {

  constructor (public dialogRef: MatDialogRef<DialogGenerateTokenView>,
               @Inject(MAT_DIALOG_DATA) public data: any){
  }

  copySecretKey(key: any){
    key.select();
    document.execCommand('copy');
    key.setSelectionRange(0, 0);
  }

  download(filename: any, text: any) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
