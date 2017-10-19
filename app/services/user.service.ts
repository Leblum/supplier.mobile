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
            urlSuffix: 'users'
        });
    }

    public register(user: IUser): Observable<Response> {
        return this.http.post(
            this.serviceConfig.rootApiUrl + CONST.ep.REGISTER ,user).catch(this.handleErrors);
    }

    private login(user: IUser): Observable<Response> {
        return this.http.post(
            this.serviceConfig.rootApiUrl + CONST.ep.AUTHENTICATE,user).catch(this.handleErrors);
    }

    public authenticate(user:IUser): Observable<IAuthenticationResponse>{
       return this.login(user).map((response)=>{
            if(response.status != 200){
                throw (`There was a problem authenticating the user err:${response.text()}`);
            }
            const authResponse: IAuthenticationResponse = response.json();
            applicationSettings.setString(CONST.CLIENT_TOKEN_LOCATION, response.json().token);
            return authResponse;
        });
    }

    public logout(){
        applicationSettings.remove(CONST.CLIENT_TOKEN_LOCATION);
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