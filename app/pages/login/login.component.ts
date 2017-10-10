import { IUser } from "../../models/index";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivityIndicator } from "ui/activity-indicator";
import  * as applicationSettings from 'application-settings';


@Component({
    selector: "login-page",
    providers: [UserService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {
    @ViewChild("container") container: ElementRef;

    user: IUser;
    public isBusy: boolean = false;
    public isRememberMeActive: boolean = false;

    constructor(private router: Router, private userService: UserService, private page: Page) {
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
            alert("Please enter a valid email address.");
            return;
        }
        this.userService.login(this.user)
            .subscribe(() => {
                this.router.navigate(["/home"]);
                this.isBusy = false;
            },
            (error) => {
                alert("Unfortunately we could not find your account.")
                this.isBusy = false;
            });
    }

    navigateToSignup(){
        this.router.navigate(['/signup']);
    }

    signUp() {
        this.isBusy = true;
        this.userService.register(this.user)
            .subscribe(() => {
                this.isBusy = false;
                alert("Your account was successfully created.");
            },
            (error) => {
                this.isBusy = false;
                alert("Unfortunately we were unable to create your account.")
            });
    }
}