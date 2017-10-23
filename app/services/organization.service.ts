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
import { IOrganization } from "../../app/models/organization.interface";


@Injectable()
export class OrganizationService extends BaseService<IOrganization> {

    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.IdentityAPIBase}${environment.V1}`,
            urlSuffix: CONST.ep.ORGANIZATIONS,
            useRestrictedEndpoint: true,
        });
    }

    public changeName(organization: IOrganization): Observable<IOrganization> {
        return super.update(organization, organization._id,null);
    }

    handleErrors(error: Response) {
        console.error(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}