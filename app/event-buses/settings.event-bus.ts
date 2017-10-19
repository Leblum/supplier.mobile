import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SettingsEventBus {
    private cancelSource = new Subject<string>();
    public cancelEvent$ = this.cancelSource.asObservable();

    constructor(){}

    cancel(){
        this.cancelSource.next('cancel');
    }
}