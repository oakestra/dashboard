import { of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Role } from '../../../root/enums/roles';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
    let userService: jasmine.SpyObj<UserService>;
    let api: jasmine.SpyObj<ApiService>;
    let service: AuthService;

    beforeEach(() => {
        userService = jasmine.createSpyObj('UserService', ['getUsername']);
        api = jasmine.createSpyObj('ApiService', ['getAuthorization']);
        service = new AuthService(userService, api);
    });

    it('should fetch and cache the roles on the first call', () => {
        userService.getUsername.and.returnValue('alice');
        api.getAuthorization.and.returnValue(of({ roles: [Role.APP_Provider] }));

        service.getAuthorization().subscribe((auth) => {
            expect(auth.roles).toEqual([Role.APP_Provider]);
        });

        expect(service.roles).toEqual([Role.APP_Provider]);
        expect(api.getAuthorization).toHaveBeenCalledWith('alice');
    });

    it('should return the cached roles without calling the API again', () => {
        userService.getUsername.and.returnValue('alice');
        api.getAuthorization.and.returnValue(of({ roles: [Role.ADMIN] }));

        service.getAuthorization().subscribe();
        api.getAuthorization.calls.reset();

        service.getAuthorization().subscribe((auth) => {
            expect(auth.roles).toEqual([Role.ADMIN]);
        });

        expect(api.getAuthorization).not.toHaveBeenCalled();
    });

    it('should forget the cached roles after clear()', () => {
        userService.getUsername.and.returnValue('alice');
        api.getAuthorization.and.returnValue(of({ roles: [Role.ADMIN] }));
        service.getAuthorization().subscribe();

        service.clear();

        expect(service.roles).toBeUndefined();
        service.getAuthorization().subscribe();
        expect(api.getAuthorization).toHaveBeenCalledTimes(2);
    });
});
