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
    selector: "forgot-password-page",
    providers: [UserService],
    templateUrl: "pages/forgot-password/forgot-password.html",
    styleUrls: ["pages/forgot-password/forgot-password.common.css", "pages/forgot-password/forgot-password.css"]
})
export class ForgotPasswordComponent implements OnInit {
    @ViewChild("container") container: ElementRef;

    public email: string;
    public isBusy: boolean = false;

    constructor(private router: Router, private userService: UserService, private page: Page) {
        // For testing
        this.email = 'tester@leblum.com'
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    backToLogin(){
        this.router.navigate(['/login']);
    }

    submit(){
        this.isBusy = true;
        if(this.userService.validateEmail({email: this.email})){
            this.userService.submitForgotPasswordRequest({email: this.email}) .subscribe(() => {
                this.isBusy = false;
                alert('We have successfully submitted your email.  If your email exists, you will recieve an email to reset your password.');
            },
            (error) => {
                alert("There was a problem submitting your email.")
                this.isBusy = false;
            });
        }
        else{
            alert('Please enter a valid email address.');
        }
    }

}