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

        if (service._id) {
            delete service._id;
        }
        const fileName = service.microservice_name + '.json';
        if (!setting.element.dynamicDownload) {
            setting.element.dynamicDownload = document.createElement('a');
        }
        const element = setting.element.dynamicDownload;
        const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(JSON.stringify(service))}`);
        element.setAttribute('download', fileName);
        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }
}
