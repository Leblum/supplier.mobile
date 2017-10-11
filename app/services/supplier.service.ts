import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { environment } from '../environments/environment';

import { ISupplier } from "../models/index";

@Injectable()
export class SupplierService {

    constructor(private http: Http) { }

    public register(supplier: ISupplier, token:string): Observable<Response> {
        let requestOptions = new RequestOptions({
            headers: new Headers({ 
                'x-access-token': token
         }),
        });
         
        return this.http.post(
            'https://dev.product.leblum.io/api' + '/v1' + "/suppliers/register", supplier ,requestOptions)
            .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}