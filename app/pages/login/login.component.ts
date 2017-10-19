import { IUser } from "../../models/index";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivityIndicator } from "ui/activity-indicator";
import  * as applicationSettings from 'application-settings';
import { AlertService } from "../../../app/services";
import { NotificationType } from "../../../app/enumerations";
import { ErrorEventBus } from "../../../app/event-buses/error.event-bus";
import * as application from "application";


@Component({
    selector: "login-page",
    providers: [UserService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login.component.css"]
})
export class LoginComponent implements OnInit {
    @ViewChild("container") container: ElementRef;

    user: IUser;
    public isBusy: boolean = false;
    public isRememberMeActive: boolean = false;

    constructor(private router: Router, private userService: UserService, private page: Page, private alertService: AlertService, private errorEventBus: ErrorEventBus) {
        // For testing
        this.user = {
            email: 'tester@leblum.com',
            password: 'password'
        };
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    initiateForgotPassword(){
        this.router.navigate(['/forgot-password']);
    }

    login() {
        this.isBusy = true;
        if (!this.userService.validateEmail(this.user)) {
            this.alertService.send({
                notificationType: NotificationType.validationError,
                text:'Please enter a valid email address.',
            });
            return;
        }
        this.userService.authenticate(this.user)
            .subscribe(authResponse => {
                this.router.navigate(["/home"]);
                this.isBusy = false;
            },
            (error) => {
                this.errorEventBus.throw(error);
                this.isBusy = false;
            });
    }

    getLogoImage(): string{
        return application.android ? 'res://logo_login' : 'res://lbresources/logo_login';
    }

    navigateToSignup(){
        this.router.navigate(['/signup']);
    }
}