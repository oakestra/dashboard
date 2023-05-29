import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { Role } from '../../../root/enums/roles';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    roles: Role[];

    constructor(private userService: UserService, private api: ApiService) {
        this.roles = undefined;
    }

    getAuthorization(): Observable<{ roles: Role[] }> {
        if (!this.roles) {
            return this.api.getAuthorization(this.userService.getUsername()).pipe(
                map((auth: { roles: Role[] }) => {
                    this.roles = auth.roles;
                    return auth;
                }),
            );
        } else {
            return of({ roles: this.roles });
        }
    }

    clear() {
        this.roles = undefined;
    }
}
