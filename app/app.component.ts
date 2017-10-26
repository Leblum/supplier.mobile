import { Component, OnInit } from "@angular/core";

import * as firebase from 'nativescript-plugin-firebase';
import { Message } from "nativescript-plugin-firebase";
import { AlertService } from "../app/services";
import * as enums from './enumerations';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private firebaseInitialized: boolean = false;
    constructor(private alertService: AlertService) {
        try {
            console.log('Calling firebase init.');
            firebase.init({
                onMessageReceivedCallback: (message: Message) => {
                    console.log('On Message recieved callback being invoked.');
                    console.log(JSON.stringify(message));
                    // So if the message was recieved and the application was in the foreground, we'll have 
                    // on set of properties and if it was in the background we'll have a different set of properties.
                    // yay for that.
                    // Background structure: {"foreground":false,"data":{"google.sent_time":{},"test":"value","google.message_id":"0:1509038356328230%9e64328a9e64328a"},"google.sent_time":{},"test":"value","google.message_id":"0:1509038356328230%9e64328a9e64328a"}
                    if (message && message.foreground === false) {
                        // Here we have a background message.  Let's see if we can pop the same thing, and alert the user.
                        this.alertService.send({
                            notificationType: enums.NotificationType.info,
                            text: JSON.stringify(message.data),
                        });
                    } else {
                        this.alertService.send({
                            notificationType: enums.NotificationType.info,
                            text: message.body,
                            title: message.title,
                        });
                    }
                },
                onPushTokenReceivedCallback: (token) => {
                    console.log("Firebase push token: " + token);
                }
            }).catch(error => {
                // Yes theres's almost always a problem where we call init more than once.  sadly I can't seem to figure out a way around this.
                console.log('There was a problem intitializing the firebase plugin');
                console.log('Error intitializing firebase plugin', error)
            });

            firebase.subscribeToTopic("supplier.news");
            firebase.subscribeToTopic("supplier.alerts");
            firebase.getCurrentPushToken().then((token: string) => {
                // may be null if not known yet
                console.log("Current push token: " + token);
            });
        } catch (err) {
            console.error(err);
        }
    }

    ngOnInit(): void {
        
    }
}
