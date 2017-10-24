import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { IMessage } from '../classes/message.interface';
import { AppError } from '../classes/app-error.class';
import { NotificationType } from '../enumerations';

@Injectable()
export class AlertService {
    private messageSource = new Subject<IMessage>();
    
    private dialogSource = new Subject<Boolean>();
    public dialogEvent$ = this.dialogSource.asObservable();

    private keepAfterNavigationChange = false;
 
    constructor(private router: Router) {
        // clear alert message on route change
        // router.events.subscribe(event => {
        //     if (event instanceof NavigationStart) {
        //         if (this.keepAfterNavigationChange) {
        //             // only keep for a single location change
        //             this.keepAfterNavigationChange = false;
        //         } else {
        //             // clear alert
        //             this.messageSource.next();
        //         }
        //     }
        // });
    }
 
    send(message: IMessage, showAfterNavigationChange = false) {
        this.keepAfterNavigationChange = showAfterNavigationChange;
        this.messageSource.next(message);
    }

    closeDialog(){
        this.dialogSource.next(true);
    }

    throw(error: AppError, showAfterNavigationChange = true){
        this.keepAfterNavigationChange = showAfterNavigationChange;
        this.messageSource.next({title:'Error', text: error.message +  '   ' + error.description, notificationType: NotificationType.danger});
    }

    getMessage(): Observable<IMessage> {
        return this.messageSource.asObservable();
    }
}