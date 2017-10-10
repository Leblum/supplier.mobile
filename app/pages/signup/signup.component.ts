import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { isAndroid } from "platform";
import { Page } from "ui/page";
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { IUser } from "../../../app/models/index";
import { SignupSteps } from "../../../app/enumerations";
import { Router } from "@angular/router";
import { UserService } from "../../../app/services/user.service";
import { ISupplier } from "../../../app/models/supplier.model";
import { Switch } from "tns-core-modules/ui/switch/switch";
import {TextField} from 'ui/text-field'

@Component({
    selector: "SignupComponent",
    moduleId: module.id,
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {

    public signupSteps = SignupSteps;
    public currentSignUpStep: SignupSteps = SignupSteps.name;

    public user: IUser = {};
    public supplier: ISupplier = {};
    public isPickupSame: boolean = false;
    
    constructor(private router: Router, public userService: UserService, private page: Page) {
        //Need to create empty objects so there's no null ref.
        this.supplier.companyAddress = {};
        this.supplier.pickupAddress = {};
        // this.user.firstName = 'test';
        // this.user.lastName = 'last';
        // this.user.phone = '303-949-6889';
    }

    public samePerson(args) {
        if (<Switch>args.object.checked) {
            if(this.user.firstName && this.user.lastName){
                this.supplier.pickupName = `${this.user.firstName} ${this.user.lastName}`;
            }
            if(this.user.phone){
                this.supplier.pickupPhone = `${this.user.phone}`;
            }
            this.isPickupSame = true;
        } else {
            this.supplier.pickupName = '';
            this.supplier.pickupPhone = '';
            this.isPickupSame = false;
        }
    }

    ngOnInit(): void {
        /* *************************************asdf**********************
        * Use the "ngOnInit" handler to initialize data for the whole tab
        * navigation layout as a whole.
        *************************************************************/
        this.page.actionBarHidden = true;
        console.log(this.currentSignUpStep);
    }

    goBack() {
        this.currentSignUpStep = --this.currentSignUpStep;
        switch (this.currentSignUpStep) {
            case 0:
                this.router.navigate(['login']);
                break;
            default:
                break;
        }
    }

    // Don't judge me for this code.
    // If I could have figured out a better way I would have.  This seems like the only way to pass form state back
    // into the view. view children, elementref, nothing seemed to get at a real control.
    isNextOn(firstNameValid: boolean, lastNameValid: boolean, emailValid: boolean, phoneValid: boolean, passwordValid: boolean,
         companyName, companyEmail, companyPhone,
        pickupAddress1, pickupAddress2, pickupCity, pickupState, pickupZip, pickupName, pickupPhone) {
        if(this.currentSignUpStep == SignupSteps.name){
            return firstNameValid && lastNameValid;
        }
        if(this.currentSignUpStep == SignupSteps.email){
            return emailValid;
        }
        if(this.currentSignUpStep == SignupSteps.phone){
            return phoneValid;
        }
        if(this.currentSignUpStep == SignupSteps.password){
            return passwordValid;
        }
        if(this.currentSignUpStep == SignupSteps.companyInfo){
            return companyName && companyEmail && companyPhone;
        }
        if(this.currentSignUpStep == SignupSteps.pickupDetails){
            return pickupAddress1 && pickupAddress2 && pickupCity && pickupState && pickupZip && pickupZip && pickupName && pickupPhone;
        }
        return true;
    }

    isNextEnabled(){
        return false;
    }
    
    isNextValid(){
        if(this.currentSignUpStep == SignupSteps.name){
            //return this.first
        }
    }

    goNext(target: SignupSteps) {
        //if (this.isStepValid()) {
            console.log(JSON.stringify(this.user));
            console.log(JSON.stringify(this.supplier));
        this.currentSignUpStep = target;
        //}
    }
}
