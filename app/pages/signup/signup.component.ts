import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { isAndroid } from "platform";
import { Page } from "ui/page";
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { IUser } from "../../../app/models/index";
import { SignupSteps, AddressType } from "../../../app/enumerations";
import { Router } from "@angular/router";
import { UserService } from "../../../app/services/user.service";
import { ISupplier } from "../../../app/models/supplier.model";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TextField } from 'ui/text-field'
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import * as utilityModule from 'utils/utils';
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";

@Component({
    selector: "SignupComponent",
    moduleId: module.id,
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {

    public signupSteps = SignupSteps;
    public currentSignUpStep: SignupSteps = SignupSteps.name;
    public nameForm: FormGroup;
    public emailForm: FormGroup;
    public phoneForm: FormGroup;
    public passwordForm: FormGroup;
    public companyInfoForm: FormGroup;
    public pickupDetailsForm: FormGroup;
    public slugForm: FormGroup;
    public termsForm: FormGroup;
    usernameControl: AbstractControl;


    public user: IUser = {};
    public supplier: ISupplier = {};
    public isPickupSame: boolean = false;
    public isTermsAgreedTo: boolean = false;
    public isBusy: boolean = false;

    constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router, public userService: UserService, private page: Page) {
        //Need to create empty objects so there's no null ref.
        this.supplier.companyAddress = {};
        this.supplier.pickupAddress = {};
        this.nameForm = this.fb.group({
            "firstName": ["firstName", [Validators.required]],
            "lastName": ["lastName", [Validators.required]]
        });
        this.emailForm = this.fb.group({
            "email": ["email", [Validators.required]],
        });
        this.phoneForm = this.fb.group({
            "phone": ["phone", [Validators.required]],
        });
        this.passwordForm = this.fb.group({
            "password": ["password", [Validators.required]],
        });
        this.companyInfoForm = this.fb.group({
            "companyName": ["companyName", [Validators.required]],
            "companyEmail": ["companyEmail", [Validators.required]],
            "companyPhone": ["companyPhone", [Validators.required]],
        });
        this.pickupDetailsForm = this.fb.group({
            "pickupAddress1": ["pickupAddress1", [Validators.required]],
            "pickupAddress2": ["pickupAddress2", []],
            "pickupCity": ["pickupCity", [Validators.required]],
            "pickupState": ["pickupState", [Validators.required]],
            "pickupZip": ["pickupZip", [Validators.required]],
            "pickupName": ["pickupName", [Validators.required]],
            "pickupPhone": ["pickupPhone", [Validators.required]],
        });
        this.slugForm = this.fb.group({
            "slug": ["slug", [Validators.required]],
        });
        this.termsForm = this.fb.group({
            "agree": ["agree", []],
        });

        // TESTING ONLY
        this.prefillForm();
    }

    public samePerson(args) {
        if (<Switch>args.object.checked) {
            if (this.user.firstName && this.user.lastName) {
                this.supplier.pickupName = `${this.user.firstName} ${this.user.lastName}`;
            }
            if (this.user.phone) {
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
        this.page.actionBarHidden = true;
        // If we're on android we need the back button to handle our "fake pages", so we're going to 
        // listen for the activity, and then "go back" whenever the hardware button is pressed.
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            data.cancel = true; // prevents default back button behavior, which kinda minimizes/closes the application. 
            this.goBack();
            this.cdr.detectChanges(); // tell angular to do change detection.  I think because this code is executed outside of angular's view
          });
    }

    goBack() {
        this.isBusy = false;
        this.currentSignUpStep = --this.currentSignUpStep;
        if (this.currentSignUpStep == 0) {
            this.router.navigate(['login']);
        }
    }

    isNextEnabled() {
        return this.isStepValid(this.currentSignUpStep);
    }

    openTermsAndConditions(){
        utilityModule.openUrl('http://leblum.com');
    }

    termsAgreedCheckChanged(args){
        if (<Switch>args.object.checked) {
            this.isTermsAgreedTo = true;
        } else {
            this.isTermsAgreedTo = false;
        }
    }

    isStepValid(validationStep) {
        switch (+validationStep) {
            case SignupSteps.name:
                return this.nameForm.valid;
            case SignupSteps.email:
                return this.emailForm.valid;
            case SignupSteps.phone:
                return this.phoneForm.valid;
            case SignupSteps.password:
                return this.passwordForm.valid;
            case SignupSteps.companyInfo:
                return this.companyInfoForm.valid;
            case SignupSteps.pickupDetails:
                return this.pickupDetailsForm.valid;
            case SignupSteps.teamUrl:
                return this.slugForm.valid;
            case SignupSteps.agreeToTerms:
                return this.isTermsAgreedTo;
            default:
                return true;
        }
    }

    prefillForm(){
        this.user = {
            firstName: 'Dave',
            lastName: 'Brown',
            email: 'dbrown@leblum.com',
            phone: '303-949-6889',
            password: 'test1234',
        }
        this.supplier = {
            name: 'Daves Flowers',
            slug:'davesFlowers',
            companyEmail: 'info@daves.com',
            companyPhone: '303-949-6889',
            companyAddress: {
                street1: '135 West 116th St.',
                street2: '#4A',
                city: 'New York',
                state: 'NY',
                zip: '80212',
                type: AddressType.business
            },
            pickupName: 'Jose',
            pickupAddress:{
                street1: 'Pickup St St.',
                street2: '#4A',
                city: 'New York',
                state: 'NY',
                zip: '80212',
                type: AddressType.pickup
            },
            pickupPhone: '303-688-8888',
        }
        //this.isTermsAgreedTo = true;
    }

    goNext(target: SignupSteps) {
        if (this.isStepValid(target - 1)) {
            this.currentSignUpStep = target;
            if(this.currentSignUpStep === SignupSteps.submitData){
                // Here we're finally ready to submit this data back to the api
                // First we're going to create a user.
                this.isBusy = true;
                this.userService.register(this.user).subscribe(response =>{
                    if(response.status == 200){
                        let userResponse: IUser = response.json();
                        // Now we have a registered user.  
                        // He's only tied into the guest organization though.  Time to create a supplier and tie them together. 
                    }
                    this.isBusy = false;
                });
            }
        }
        else{
            alert('Please fill out all the required fields on the form.');
        }
    }
}
