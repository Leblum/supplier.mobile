import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { IUser } from "../models/index";
import { environment } from "../../app/environments/environment";
import * as applicationSettings from "application-settings";
import { CONST } from "../../app/constants";
import { IAuthenticationResponse } from "../../app/models/authentication.interface";
import { BaseService } from "../../app/services/base/base.service";


@Injectable()
export class UserService extends BaseService<IUser> {

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.IdentityAPIBase}${environment.V1}`,
            urlSuffix: CONST.ep.USERS,
            useRestrictedEndpoint: true
        });
    }

    public register(user: IUser): Observable<Response> {
        return this.http.post(
            this.serviceConfig.rootApiUrl + CONST.ep.REGISTER ,user).catch(this.handleErrors);
    }

    private authenticate(user: IUser): Observable<Response> {
        return this.http.post(
            this.serviceConfig.rootApiUrl + CONST.ep.AUTHENTICATE,user).catch(this.handleErrors);
    }

    public login(user:IUser): Observable<IAuthenticationResponse>{
        // Make sure we clear the other login details out first.
        this.logout();
       return this.authenticate(user).map((response)=>{
            if(response.status != 200){
                throw (`There was a problem authenticating the user err:${response.text()}`);
            }
            const authResponse: IAuthenticationResponse = response.json();
            applicationSettings.setString(CONST.CLIENT_TOKEN_LOCATION, authResponse.token);
            applicationSettings.setString(CONST.CLIENT_DECODED_TOKEN_LOCATION, JSON.stringify(authResponse.decoded));
            applicationSettings.setString(CONST.CURRENT_USER_ID, authResponse.decoded.userId);
            return authResponse;
        });
    }

    public logout(){
        applicationSettings.remove(CONST.CLIENT_TOKEN_LOCATION);
        applicationSettings.remove(CONST.CLIENT_DECODED_TOKEN_LOCATION);
        applicationSettings.remove(CONST.CURRENT_USER_ID);
    }

    public changePassword(newPassword: string){
        let user: IUser = {
            password:newPassword,
            _id: applicationSettings.getString(CONST.CURRENT_USER_ID)
        }
        return this.http.put(
            `${this.serviceConfig.rootApiUrl}${CONST.ep.USERS}${CONST.ep.RESTRICTED}${CONST.ep.UPDATE_PASSWORD}/${user._id}`, 
            user, this.requestOptions)
            .catch(this.handleErrors);
    }

    public submitForgotPasswordRequest(user: IUser): Observable<Response>{
        return this.http.post(
            this.serviceConfig.rootApiUrl + CONST.ep.PASSWORD_RESET_REQUEST, user).catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.error(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    public validateEmail(user: IUser): boolean {
            var re = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            return re.test(user.email);
    }
}