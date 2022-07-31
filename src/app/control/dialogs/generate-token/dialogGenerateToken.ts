import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-generate-token.html',
  styleUrls: ['./dialog-generate-token.css']
})

export class DialogGenerateTokenView {

  local_data: any;

  constructor (public dialogRef: MatDialogRef<DialogGenerateTokenView>,
               @Inject(MAT_DIALOG_DATA) public data: any){
      this.local_data = data;
      //document.getElementsByClassName("text").namedItem(this.data)
      //document.getElementById('id1').value=this.data;
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

  getData(): string{
    return this.local_data;
  }
}
