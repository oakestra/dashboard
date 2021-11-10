import {Component, Inject} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-connection-settings.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})
export class DialogConnectionSettings {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  canViewLatConstrains: boolean = true;

  onRadioChange(event: MatRadioChange) {
    this.canViewLatConstrains = event.value == 1;
  }
}
