import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MimeType } from '../../enumerations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'

import { ServiceError } from '../../classes/app-error.class'
import { IBaseModel } from '../../models';
import { environment } from "../../environments/environment";
import { IServiceConfig } from './service.config';
import { RestUrlConfigType, RestUrlBuilder } from '../../builders/rest-url.builder';
import { CONST } from '../../constants';
import * as applicationSettings from "application-settings";


export class BaseService<T extends IBaseModel> {

    //region instance variables
    protected restUrlBuilder: RestUrlBuilder = new RestUrlBuilder();
    protected requestOptions: RequestOptions;
    protected serviceConfig: IServiceConfig;
    protected identityApiBaseV1: string = `${environment.IdentityAPIBase}${environment.V1}`;
    protected productApiBaseV1: string = `${environment.ProductAPIBase}${environment.V1}`;
    //endregion

    // tslint:disable-next-line:member-ordering
    public static convertToClass<T>(obj: Object, classToInstantiate): T {
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                classToInstantiate[i] = obj[i];
            }
        }
        return classToInstantiate;
    }

    constructor(
        protected http: Http,
        serviceConfig: IServiceConfig
    ) {
        this.serviceConfig = serviceConfig;
        this.requestOptions = new RequestOptions({
            headers: new Headers({ 
                'Content-Type': MimeType.JSON,
                'x-access-token': applicationSettings.getString(CONST.CLIENT_TOKEN_LOCATION)
         }),
        });

        this.restUrlBuilder.withConfig({
            rootApiUrl: this.serviceConfig.rootApiUrl,
            urlSuffix: this.serviceConfig.urlSuffix,
            useRestricted: this.serviceConfig.useRestrictedEndpoint,
        });

        return this;
    }

    // Because we only create a singleton on these classes, the auth token can get stale, so we pull a fresh copy out on every base call.
    refreshAuthToken(){
        this.requestOptions = new RequestOptions({
            headers: new Headers({ 
                'Content-Type': MimeType.JSON,
                'x-access-token': applicationSettings.getString(CONST.CLIENT_TOKEN_LOCATION)
         }),
        });
    }

    get<T extends IBaseModel>(id: string): Observable<T> {
        this.refreshAuthToken();
        const url = this.buildUrl({ id: id , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getList<T extends IBaseModel>(query?: Object): Observable<T[]> {
        this.refreshAuthToken();
        const url = this.buildUrl({ query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    search<T extends IBaseModel>(query?: Object): Observable<T[]> {
        this.refreshAuthToken();
        const url = this.buildUrl();
        return this.http
            .post(this.serviceConfig.rootApiUrl + this.serviceConfig.urlSuffix + CONST.ep.QUERY, query,this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }


    delete<T extends IBaseModel>(id: string, query?: Object): Observable<void> {
        this.refreshAuthToken();
        const url = this.buildUrl({ id, query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http
            .delete(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    create<T extends IBaseModel>(T: T, query?: Object): Observable<T> {
        this.refreshAuthToken();
        const url = this.buildUrl({ query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http
            .post(url, T, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    update<T extends IBaseModel>(T: T, id: string, query?: Object): Observable<T> {
        this.refreshAuthToken();
        const url = this.buildUrl({ id: id, query: query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        console.log(url);
        return this.http
            .patch(url, T, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // This is used for single operations that execute, and return a single object.
    // item.checkout is a good example of this kind of operation.
    // We will clear chache when this method gets executed
    executeSingleOperation<T extends IBaseModel>(id: string, operation?: string, query?: Object): Observable<T> {
        this.refreshAuthToken();
        const url: string = this.buildUrl({ id, operation, query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // This is used for listing operations that return a list of objects.
    // item.versions is a good example, where you're going to return a list of items.
    executeListOperation<T extends IBaseModel>(id: string, operation: string, query?: Object): Observable<T[]> {
        this.refreshAuthToken();
        const url = this.buildUrl({ id, operation, query , useRestricted: this.serviceConfig.useRestrictedEndpoint });
        return this.http.get(url, this.requestOptions).map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
    }

    protected buildUrl(configuration?: RestUrlConfigType): string {
        return this.restUrlBuilder.withConfig(configuration).build();
    }


    // The server will be sending this back:
    // response.json({
    //     message: error.message || 'Server Error',
    //     status: error.status || 500,
    //     URL: request.url,
    //     method: request.method,
    //     stack: Config.active.get('returnCallStackOnError') ? error.stack : '',
    //     requestBody: request.body
    // });
    protected handleError(errorResponse: Response | any) {
        // TODO: Implement Real Logging infrastructure.
        // Might want to log to remote server (Fire and forget style)
        const appError = new ServiceError();
        if (errorResponse instanceof Response) {
            const body = errorResponse.json() || '';
            appError.message = body.message ? body.message : 'no message provided';
            appError.description = body.description ? body.description : 'no description provided';
            appError.stack = body.stack ? body.stack : 'no stack provided';
            appError.statusCode = errorResponse.status;
            appError.statusText = errorResponse.statusText;
            return Observable.throw(appError);
        } else {
            appError.message = typeof errorResponse.message !== 'undefined' ? errorResponse.message : errorResponse.toString();
            return Observable.throw(appError);
        }
    }
}

