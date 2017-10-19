import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CONST } from '../constants';
import { AlertService } from '../services/index';
import { NotificationType } from '../enumerations';
import * as applicationSettings from "application-settings";

@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private alertService: AlertService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('Checking auth token for user.');
        if (!applicationSettings.getString(CONST.CLIENT_TOKEN_LOCATION)) {
            console.log('Auth token not found in storage, sending to login.');
            // Not logged in so send them to login.
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            this.alertService.send({
                notificationType: NotificationType.danger,
                text: 'Not authenticated.'
            });
            return false;
        }
        return true;
    }
}