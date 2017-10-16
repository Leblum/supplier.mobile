import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/';
import { IMessage } from '../classes/message.interface';
import { NotificationType } from '../enumerations';
import * as dialogs from "ui/dialogs";

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            if (message) {
                this.calculateMessageTitle(message);
                dialogs.alert({
                    title: message.title,
                    message: message.text,
                    okButtonText: 'Ok',
                }).then(() => {
                    this.alertService.closeDialog();
                });
            }
        });
    }

    calculateMessageTitle(message: IMessage) {
        // If there isn't a message title, we're going to default one.
        if (!message.title) {
            switch (+message.notificationType) {
                case NotificationType.success:
                    message.title = 'Success';
                    break;
                case NotificationType.empty:
                    message.title = '';
                    break;
                case NotificationType.danger:
                    message.title = 'Error';
                    break;
                case NotificationType.info:
                    message.title = 'Alert';
                    break;
                case NotificationType.warning:
                    message.title = 'Validation Error';
                    break;
                default:
                    break;
            }
        }
    }

    calculateTimerDelay(message: IMessage): number {
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case NotificationType.danger:
                    return 5000;
                case NotificationType.info:
                    return 1000;
                case NotificationType.warning:
                    return 5000;
                case NotificationType.success:
                    return 1000;
                default:
                    return 1000;
            }
        }
    }

    calculateIcon(message: IMessage) {
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case NotificationType.danger:
                    return "ti-alert";
                case NotificationType.info:
                    return "ti-info";
                case NotificationType.warning:
                    return "ti-bell";
                case NotificationType.success:
                    return "ti-check";
                default:
                    break;
            }
        }
        return '';
    }
}