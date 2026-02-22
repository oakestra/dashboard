import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MarketplaceService {


    /**
   * Constructs the Marketplace URL based on the environment API URL
   */
    getMarketplaceUrl(): string {
        try {
            const url = new URL(environment.apiUrl);
            return `http://${url.hostname}:11103`;
        } catch (e) {
        // Fallback if URL parsing fails
            return 'http://localhost:11103';
        }
    }

    /**
   * Checks if the Marketplace UI is reachable from the client's network
   */
    isReachable(): Observable<boolean> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        return from(
            fetch(`${this.getMarketplaceUrl()}/health`, {
                mode: 'no-cors',
                signal: controller.signal
            })
        ).pipe(
            map(() => true),
            catchError(() => of(false)),
            map(result => {
                clearTimeout(timeout);
                return result;
            })
        );
    }
}
