import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'dialog-graph-example-dialog',
  templateUrl: 'dialog-graph-connection-settings.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})
export class DialogGraphConnectionSettings {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  canViewLatConstrains: boolean = true;

  onRadioChange(event: MatRadioChange) {
    this.canViewLatConstrains = event.value == 1;
  }
}
