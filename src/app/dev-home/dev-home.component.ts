import {Component, OnInit} from '@angular/core';
import {JobService} from "../services/job.service";
import {Job} from "../objects/job";
import {SharedIDService} from "../services/shared-id.service";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  //activeApp: Application;
  jobs: Job[] | undefined;

  constructor(private service: JobService, public sharedService: SharedIDService) {}

  // Get alL Jobs in this Application
  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.jobs = data as Job[];
    });
  }
}
