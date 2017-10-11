import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { IUser } from "../models/index";
import { environment } from "../../app/environments/environment";

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    public register(user: IUser): Observable<Response> {
        return this.http.post(
            environment.IdentityAPIBase + environment.IdentityAPIVersion + "/register",user).catch(this.handleErrors);
    }

    public login(user: IUser): Observable<Response> {
        return this.http.post(
            environment.IdentityAPIBase + environment.IdentityAPIVersion + "/authenticate",user).catch(this.handleErrors);
    }

    public submitForgotPasswordRequest(user: IUser): Observable<Response>{
        return this.http.post(
            environment.IdentityAPIBase + environment.IdentityAPIVersion + "/password-reset-request",user).catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    public validateEmail(user: IUser): boolean {
            var re = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            return re.test(user.email);
    }
}