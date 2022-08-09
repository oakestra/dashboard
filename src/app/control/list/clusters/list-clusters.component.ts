import {Component, Input, Inject, Optional} from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dev-home',
  templateUrl: 'list-clusters.component.html',
  styleUrls: ['./list-clusters.component.css']
})

export class ListClustersComponent {

  @Input() clusters: any = []

  constructor (){
  }
}
