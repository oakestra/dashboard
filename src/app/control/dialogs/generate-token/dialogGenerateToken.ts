import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-generate-token.html',
  styles: [
    '.full-width{width: 80%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogGenerateTokenView {

  constructor (public dialogRef: MatDialogRef<DialogGenerateTokenView>){
  }
}
