import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { IUser } from "../models/index";

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    public register(user: IUser): Observable<void> {
        return this.http.post(
            'https://dev.identity.leblum.io/api' + '/v1' + "/register",
            {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                isTokenExpired: false,
                isEmailVerified: false, 
            }).catch(this.handleErrors);
    }

    public login(user: IUser): Observable<void> {
        return this.http.post(
            'https://dev.identity.leblum.io/api' + '/v1' + "/authenticate",
            {
                email: user.email,
                password: user.password,
            }).catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    public validateEmail(user: IUser): boolean {
        return true;
    }
}