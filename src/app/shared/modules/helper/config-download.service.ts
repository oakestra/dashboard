import { Injectable } from '@angular/core';
import { IService } from '../../../root/interfaces/service';

@Injectable({
    providedIn: 'root',
})
export class ConfigDownloadService {
    public static download(service: IService) {
        const setting = {
            element: {
                dynamicDownload: null as any,
            },
        };

        const config = {
            microservices: [
                {
                    ...this.cleanService(service),
                },
            ],
        };
        console.log(service);

        const fileName = service.microservice_name + '.json';
        if (!setting.element.dynamicDownload) {
            setting.element.dynamicDownload = document.createElement('a');
        }
        const element = setting.element.dynamicDownload;
        const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(JSON.stringify(config))}`);
        element.setAttribute('download', fileName);
        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }

    // Delete service data that are only relevant for a running service.
    private static cleanService(service: IService): IService {
        const s: IService = {
            microservice_name: service.microservice_name ?? null,
            microservice_namespace: service.microservice_namespace ?? null,
            virtualization: service.virtualization ?? null,
            description: service.description ?? null,
            cmd: service.cmd ?? null,
            memory: service.memory ?? null,
            vcpus: service.vcpus ?? null,
            vgpus: service.vgpus ?? null,
            vtpus: service.vtpus ?? null,
            bandwidth_in: service.bandwidth_in ?? null,
            bandwidth_out: service.bandwidth_out ?? null,
            storage: service.storage ?? null,
            code: service.code ?? null,
            state: service.state ?? null,
            port: service.port ?? null,
            addresses: service.addresses ?? null,
            added_files: service.added_files ?? null,
            constraints: service.constraints ?? null,
            status: service.status ?? null,
            connectivity: service.connectivity ?? null,
            args: service.args ?? null,
            environment: service.environment ?? null,
        };

        const filteredObj: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(s)) {
            if (value !== null) {
                filteredObj[key] = value;
            }
        }

        return filteredObj;
    }
}
