import { Injectable } from '@angular/core';

export interface ParsedSlaResult {
    type: 'v2' | 'v1_microservices';
    data: any; 
    appName?: string; 
}

@Injectable({
    providedIn: 'root',
})
export class SlaParserService {
    constructor() {}

    /**
     * Parses the SLA JSON.
     * Supports both legacy Dashboard format (v1) and new API/CLI format (v2).
     *
     * @param data The JSON object loaded from the file
     * @param currentAppName (Optional) The name of the current application to validate against.
     *                       If provided, it will be checked against the value in v2 SLAs.
     */
    parse(data: any, currentAppName?: string): ParsedSlaResult {
        if (data.applications && Array.isArray(data.applications) && data.applications.length > 0) {
            const app = data.applications[0];

            // validate vpplication name consistency
            if (currentAppName && app.application_name !== currentAppName) {
                throw new Error(
                    `SLA Error: The file belongs to application "${app.application_name}", but you are currently editing "${currentAppName}".`,
                );
            }

            if (!app.microservices) {
                throw new Error('SLA Error: Application descriptor found, but no microservices list is present.');
            }

            return {
                type: 'v2',
                data: data,
                appName: app.application_name,
            };
        }

        // legacy format where root key is 'microservices'
        if (data.microservices && Array.isArray(data.microservices)) {
            return {
                type: 'v1_microservices',
                data: data.microservices,
            };
        }

        // invalid format
        throw new Error('Invalid SLA format: Could not find "applications" or "microservices" properties.');
    }
}
