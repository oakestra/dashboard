import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ApiService } from '../../../shared/modules/api/api.service';
import { DialogGraphConnectionView } from '../dialogs/graph-content-connection/dialog-graph-connection-view.component';
import { CleanJsonService } from '../../../shared/util/clean-json.service';

declare function start(nodes: any, links: any): void;
declare function deleteLink(): void;

@Component({
    selector: 'graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnChanges {
    @Output() updated = new EventEmitter<string>();
    @Input() services: any;
    showConnections = false;
    nodes: any[] = [];
    links: any[] = [];

    constructor(public dialog: NbDialogService, public api: ApiService) {}

    ngOnChanges() {
        this.showConnections = false;
    }

    async openDialog(start: string, target: string, mode: string) {
        const service: any = await this.getService(start);
        let conn = this.findCorrectConstraint(target, service.connectivity);

        let data = {
            start_serviceID: start,
            target_serviceID: target,
            type: 'geo',
            threshold: 100,
            rigidness: 10,
            convergence_time: 300,
        };
        if (conn) {
            conn = conn[0];
            data = {
                start_serviceID: start,
                target_serviceID: target,
                type: conn.type,
                threshold: conn.threshold,
                rigidness: conn.rigidness,
                convergence_time: conn.convergence_time,
            };
        }
        const dialogRef = this.dialog.open(DialogGraphConnectionView, { context: { data } });
        dialogRef.onClose.subscribe((result) => {
            if (result.event === 'Save') {
                void this.saveGraphConstrains(result.data);
            } else if (result.event === 'Cancel' && mode === 'new') {
                deleteLink();
            } else if (result.event === 'Delete') {
                this.deleteOnlyLink(start, target);
            } else if (result.event === 'Switch') {
                void this.openDialog(target, start, 'edit');
            }
        });
    }

    findCorrectConstraint(target: string, arr: any) {
        let conn = null;
        for (const a of arr) {
            if (a.target_microservice_id === target) {
                conn = a.con_constraints;
            }
        }
        return conn;
    }

    async saveGraphConstrains(data: any): Promise<void> {
        const serviceProm: any = await this.getService(data.start_serviceID);
        const newService = serviceProm;
        const index = newService.connectivity.findIndex((d: any) => d.target_microservice_id === data.target_serviceID);
        if (index < 0) {
            // add new constrains
            newService.connectivity.push({
                target_microservice_id: data.target_serviceID,
                con_constraints: [
                    {
                        type: data.type,
                        threshold: data.threshold,
                        rigidness: data.rigidness,
                        convergence_time: data.convergence_time,
                    },
                ],
            });
        } else {
            // edit existing constraint
            newService.connectivity[index] = {
                target_microservice_id: data.target_serviceID,
                con_constraints: [
                    {
                        type: data.type,
                        threshold: data.threshold,
                        rigidness: data.rigidness,
                        convergence_time: data.convergence_time,
                    },
                ],
            };
        }
        this.update(newService);
    }

    async getService(id: string) {
        return new Promise((job) => {
            this.api.getServiceByID(id).subscribe((x) => {
                job(x);
            });
        });
    }

    // TODO Move this to a service
    generateSLA(sla: any) {
        let jsonContent = {
            api_version: 'v2.0',
            sla_version: 'v2.0',
            customerID: '',
            applications: [
                {
                    // "applicationID": this.currentApplication._id.$oid,
                    // "application_name": this.currentApplication.application_name,
                    // "application_namespace": this.currentApplication.application_namespace,
                    // "application_desc": this.currentApplication.application_desc,
                    microservices: [{}],
                },
            ],
            args: [] as any[],
        };
        jsonContent.applications[0].microservices = [sla];
        jsonContent = CleanJsonService.cleanData(jsonContent);

        return jsonContent;
    }

    update(service: any) {
        const sla = this.generateSLA(service);
        this.api.updateService(sla, service.microserviceID).subscribe(() => console.log('Updated Constrains'));
    }

    getNodes() {
        this.nodes = [];
        for (const service of this.services) {
            this.nodes.push({
                id: service.microservice_name,
                idNumber: service._id.$oid,
            });
        }
        this.calculateLinks();
    }

    calculateLinks() {
        for (const service of this.services) {
            if (service.connectivity !== undefined) {
                for (const targetService of service.connectivity) {
                    this.links.push({
                        source: service._id.$oid,
                        target: targetService.target_microservice_id,
                    });
                }
            }
        }
    }

    toggleConnection() {
        this.showConnections = !this.showConnections;
    }

    get showConButton() {
        return this.showConnections ? 'Hide Connection Graph' : 'Show Connection Graph';
    }

    multipleFunctions() {
        this.toggleConnection();
        this.getNodes();
        this.start();
    }

    delete(id: any) {
        this.updated.emit(id);
        deleteLink();
    }

    deleteOnlyLink(start: string, target: string) {
        this.api.getServiceByID(start).subscribe((service: any) => {
            const index = service.connectivity.findIndex((d: any) => d.target_microservice_id === target);
            service.connectivity.splice(index, 1);
            this.update(service);
        });
        deleteLink(); // deletes Lin in the graph
    }

    start() {
        const linksNew = [];
        const l = this.links;
        const n = this.nodes;
        // TODO Dont use triple loop
        for (let x = 0; x < l.length; x++) {
            for (let i = 0; i < n.length; i++) {
                for (let j = 0; j < n.length; j++) {
                    if (l[x].source === n[i].idNumber && l[x].target === n[j].idNumber) {
                        // To combine two links between nodes to one, but then you have problems with if you
                        // want to delete on connection.

                        // let backwardsLink = {source: n[j], target: n[i], left: false, right: true}
                        // let index: number = linksNew.findIndex(x => (x.source == n[j] && x.target == n[i]))
                        // console.log("index")
                        // console.log(index)
                        // if (index >= 0) {
                        //   linksNew[index] = ({source: n[i], target: n[j], left: true, right: true})
                        // } else {
                        linksNew.push({ source: n[i], target: n[j], left: false, right: true });
                        // }
                    }
                }
            }
        }
        start(this.nodes, linksNew);
    }
}
