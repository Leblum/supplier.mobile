import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';

import { ISupplier, IUser } from "../models/index";
import { UserService } from "../../app/services";
import { IAuthenticationResponse } from "../../app/models/authentication.interface";
import { BaseService } from "../../app/services/base/base.service";
import * as applicationSettings from "application-settings";
import { CONST } from "../../app/constants";
import  * as enums from "../../app/enumerations";

@Injectable()
export class SupplierService extends BaseService<ISupplier> {

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.ProductAPIBase}${environment.V1}`,
            urlSuffix: CONST.ep.SUPPLIERS,
            useRestrictedEndpoint: false
        });
    }

    public getSupplierFromOrganization(organizationID: string): Observable<ISupplier>{
        return super.search({
            "ownerships.ownerId": organizationID,
            "ownerships.ownershipType": enums.OwnershipType.organization
        }).map(suppliers =>{
            if(suppliers && suppliers.length > 0){
                return suppliers[0];
            }
        }).catch(this.handleError);
    }

    public register(supplier: ISupplier, token: string): Observable<Response> {
        let url = this.serviceConfig.rootApiUrl + CONST.ep.SUPPLIERS + CONST.ep.REGISTER
        this.logUrl(url, CONST.verbs.POST);
        return this.http.post(url, supplier, {
                headers: new Headers({ 
                    'Content-Type': MimeType.JSON,
                    'x-access-token': token
             }),
            })
            .catch(this.handleError);
    }

    public createNewSupplierTeam(supplier: ISupplier, user: IUser): Observable<IAuthenticationResponse> {
            // try this again.
            const userService = new UserService(this.http);
            // First we register the new user.
            return userService.register(user).map(response => {
                if (response.status != 201) {
                    throw ('There was a problem registering the user' + response.text());
                }
                let registeredUser: IUser = response.json();
                return registeredUser;
            })
            // Then we login the newly registered user, so we can use his token when we create suppliers
            .flatMap(registeredUser => {
                return userService.login(user);
            })
            // Double check that our login response wasn't something crazy.
            .map(authResponse => {
                // Now we grab the token off this guy.
                console.log(`login response successfull.`);
                return authResponse.token;
            })
            // Register the supplier, with the new token.
            .flatMap(token => {
                console.log(`About to try and register a supplier ${token}`)
                return this.register(supplier, token);
            })
            // double check that our registration worked.
            .map(supplierRegistrationResponse => {
                if (supplierRegistrationResponse.status != 201) {
                    throw ('There was a problem registering the supplier err:' + supplierRegistrationResponse.text)
                }

                let createdSupplier: ISupplier = supplierRegistrationResponse.json();
                console.log(`Registered Supplier Response ${createdSupplier._id}`);
                return createdSupplier;
            })
            // Because of supplier registration moving a user around, we're going to reAuth the user to get updated organizationID, and 
            // updated user roles.  This will also double check that nothing went wrong.
            .flatMap(() => {
                return userService.login(user);
            })
            .map(finalAuthResponse => {
                console.log(`Created user token: ${finalAuthResponse.token}`);
                return finalAuthResponse;
            }).catch(this.handleError);
    }
}