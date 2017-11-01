import { Component, OnInit } from "@angular/core";

import { AlertService } from "../app/services";
import * as enums from './enumerations';
import {FirebaseMessaging} from './classes/firebase.messaging';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    constructor(private alertService: AlertService, private firebaseMessaging: FirebaseMessaging) {
        try {
            firebaseMessaging.initializeFirebase();
        } catch (err) {
            console.error(err);
        }
    }

    ngOnInit(): void {
        
    }
}
