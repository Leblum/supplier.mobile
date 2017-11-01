import * as firebase from 'nativescript-plugin-firebase';
import { Message } from "nativescript-plugin-firebase";
import { AlertService } from "../../app/services";
import * as enums from '../enumerations';
import * as applicationSettings from "application-settings";
import { CONST } from '../../app/constants';
import { UserService, SupplierService } from '../../app/services/';
import { ITokenPayload, IUser, ISupplier } from '../../app/models';
import { ErrorEventBus } from '../../app/event-buses/error.event-bus';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseMessaging{

    constructor(private alertService: AlertService, 
        private userService: UserService, 
        private errorEventBus: ErrorEventBus,
        private supplierService: SupplierService
    ){

    }

    initializeFirebase(){
        if(firebase['instance'] == null){
            console.log('Calling firebase init.');
            firebase.init({
                onMessageReceivedCallback: (message: Message) => {
                    console.log('On Message recieved callback being invoked.');
                    console.dir(message);
                    // So if the message was recieved and the application was in the foreground, we'll have 
                    // on set of properties and if it was in the background we'll have a different set of properties.
                    // yay for that.
                    // Background structure: {"foreground":false,"data":{"google.sent_time":{},"test":"value","google.message_id":"0:1509038356328230%9e64328a9e64328a"},"google.sent_time":{},"test":"value","google.message_id":"0:1509038356328230%9e64328a9e64328a"}
                    if (message && message.foreground === false) {
                        // Here we have a background message.  Let's see if we can pop the same thing, and alert the user.
                        console.dir(message.data);
                        console.dir(message.body);
                        this.alertService.send({
                            notificationType: enums.NotificationType.info,
                            title: 'Background Notification',
                            text: message.data,
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
                this.errorEventBus.throw(error);
                console.log('There was a problem intitializing the firebase plugin');
                console.log('Error intitializing firebase plugin', error)
            });
        }

        this.subscribeToTopics();
        this.updateCurrentFirebaseToken();
    }

    public updateCurrentFirebaseToken(){

        // This is the current token for the device for push notifications.
        firebase.getCurrentPushToken().then((token: string) => {
            // may be null if not known yet
            console.log(`Current push token: ${token}`);
            // There's a possibility that the token will be null in which case we should just return
            if(!token){ 
                console.log('The push token came back as null.  Were not going to set a null token')
                return; 
            }
            applicationSettings.setString(CONST.CLIENT_FIREBASE_PUSH_TOKEN, token);
            console.log(`Stored Push Token in application Settings`);

            // If the current user is logged in, we're going to pull their token out, so we can make sure their push tokens are updated/current.
            if(applicationSettings.hasKey(CONST.CLIENT_DECODED_TOKEN_LOCATION)){
                let tokenPayload: ITokenPayload = JSON.parse(applicationSettings.getString(CONST.CLIENT_DECODED_TOKEN_LOCATION));
                
                this.userService.get(tokenPayload.userId)
                .flatMap( (user:IUser) => {
                    if(user){
                        this.addToken(user,token);
                    }
                    return this.userService.update(user,user._id);
                })
                // Now we will also update the supplier record with all their push tokens.
                .flatMap( user => {
                    return this.supplierService.getSupplierFromOrganization(tokenPayload.organizationId);
                })
                .flatMap((supplier: ISupplier) =>{
                    this.addToken(supplier, token);
                    return this.supplierService.update(supplier, supplier._id);
                })
                .subscribe( updatedSupplier =>{
                    console.log('The supplier and their push tokens are up to date.');
                    console.log('Heres the updated supplier push tokens: ' + JSON.stringify(updatedSupplier.pushTokens));
                    return updatedSupplier;
                },error => {
                    this.errorEventBus.throw(error);
                });
            }
        });
    }

    private addToken(tokenContainer: IUser | ISupplier, token: string){
        // here now we have the current user, we're going to add this token to them if it doesn't exist.
        if(tokenContainer && !tokenContainer.pushTokens){
            tokenContainer.pushTokens = new Array<string>();
        }

        if( tokenContainer.pushTokens.findIndex(currentLiveToken =>{
            return currentLiveToken == token;
        }) === -1){
            console.log('Actually adding a push token to the user/supplier object.')
            tokenContainer.pushTokens.push(token);
        }
    }

    private subscribeToTopics(){
        // These are topics we can use to spam all of our suppliers!
        firebase.subscribeToTopic("supplier.news");
        firebase.subscribeToTopic("supplier.alerts");
    }
}