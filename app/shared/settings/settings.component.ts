import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, Input } from "@angular/core";
import { isAndroid } from "platform";
import { Page } from "ui/page";
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { IUser, ISupplier, IAuthenticationResponse, ITokenPayload, IOrganization } from "../../../app/models/index";
import { SignupSteps, AddressType, NotificationType, SettingsFormStyle } from "../../../app/enumerations";
import { Router } from "@angular/router";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TextField } from 'ui/text-field'
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import * as utilityModule from 'utils/utils';
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { } from "../../../app/models/authentication.interface";
import { SupplierService, AlertService, OrganizationService, UserService } from "../../../app/services";
import { ErrorEventBus } from "../../../app/event-buses/error.event-bus";
import { SettingsEventBus } from "../../../app/event-buses/settings.event-bus";
import * as applicationSettings from "application-settings";
import { CONST } from "../../../app/constants";

@Component({
    selector: "SettingsComponent",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {

    @Input() public isSettingsForm: boolean;
    @Input() public currentFormStyle: SettingsFormStyle;

    public signupSteps = SignupSteps;
    public settingsFormStyle = SettingsFormStyle;
    public currentSignUpStep: SignupSteps;

    //region Forms
    public nameForm: FormGroup;
    public emailForm: FormGroup;
    public phoneForm: FormGroup;
    public passwordForm: FormGroup;
    public companyInfoForm: FormGroup;
    public pickupDetailsForm: FormGroup;
    public slugForm: FormGroup;
    public termsForm: FormGroup;
    //endregion

    public user: IUser = {};
    public supplier: ISupplier = {};
    public organization: IOrganization = {};
    public isPickupSame: boolean = false;
    public isTermsAgreedTo: boolean = false;
    public isBusy: boolean = false;
    public hasSubmitted: boolean = false;
    public passwordConfirm: string = '';

    constructor(private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private router: Router,
        public userService: UserService,
        private page: Page,
        private suppliserService: SupplierService,
        private errorEventBus: ErrorEventBus,
        private alertService: AlertService,
        private settingsEventBus: SettingsEventBus,
        private organizationService: OrganizationService
    ) {
        //Need to create empty objects so there's no null ref.
        this.supplier.companyAddress = {};
        this.supplier.pickupAddress = {};
        //region Form validation Setup
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
            "passwordConfirm": ["passwordConfirm", [Validators.required]],
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
        //endregion

        console.log('in on constructor in settings component');
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
        console.log('in on init in settings component');
        this.page.actionBarHidden = true;
        // If we're on android we need the back button to handle our "fake pages", so we're going to 
        // listen for the activity, and then "go back" whenever the hardware button is pressed.
        if (application.android) {
            if (this.isSettingsForm) {
                // This certainly doesn't seem to work, but it at least keeps it from crashing.  At some point maybe we can look into how to fix this.
                application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                    data.cancel = true; // prevents default back button behavior, which kinda minimizes/closes the application. 
                    this.cancel();
                    this.cdr.detectChanges(); // tell angular to do change detection.  I think because this code is executed outside of angular's view
                });
            }
            else {
                application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                    data.cancel = true; // prevents default back button behavior, which kinda minimizes/closes the application. 
                    this.goBack();
                    this.cdr.detectChanges(); // tell angular to do change detection.  I think because this code is executed outside of angular's view
                });
            }
        }

        console.log(`Current Settings Form Style ${this.currentFormStyle}`);
        if (!this.isSettingsForm) {
            this.currentSignUpStep = SignupSteps.name;
            // TESTING ONLY
            this.prefillForm();
        }

        if (this.isSettingsForm) {
            // Here because it's a settings form, we're going to load data from the API.
            let tokenPayload: ITokenPayload = JSON.parse(applicationSettings.getString(CONST.CLIENT_DECODED_TOKEN_LOCATION));

            this.userService.get(tokenPayload.userId).subscribe(user => {
                this.user = user;
            }, error => { this.errorEventBus.throw(error); });

            this.organizationService.get(tokenPayload.organizationId).subscribe(org => {
                this.organization = org;
            }, error => { this.errorEventBus.throw(error); });

            this.suppliserService.getSupplierFromOrganization(tokenPayload.organizationId).subscribe(supplier => {
                this.supplier = supplier;
            }, error => { this.errorEventBus.throw(error); });
        }
    }

    goBack() {
        this.isBusy = false;

        this.currentSignUpStep = this.currentSignUpStep == 0 ? this.currentSignUpStep : --this.currentSignUpStep;
        if (this.currentSignUpStep == 0) {
            this.isBusy = true;
            this.router.navigate(['login']);
        }
    }

    isNextEnabled() {
        return this.isStepValid(this.currentSignUpStep);
    }

    openTermsAndConditions() {
        utilityModule.openUrl('http://leblum.com');
    }

    termsAgreedCheckChanged(args) {
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
                return this.passwordForm.valid && this.user.password === this.passwordConfirm;
            case SignupSteps.companyInfo:
                return this.companyInfoForm.valid;
            case SignupSteps.pickupDetails:
                return this.pickupDetailsForm.valid;
            case SignupSteps.teamUrl:
                return this.slugForm.valid;
            case SignupSteps.agreeToTerms:
                return this.isTermsAgreedTo;
            // We only turn on the next button if the user hasn't submitted any data yet.
            // UI wise this doesn't really have time to change the 'enabled' on the button, 
            // but this will keep the user from submitting more than once.
            case SignupSteps.submitData:
                return !this.hasSubmitted;
            default:
                return true;
        }
    }

    prefillForm() {
        this.user = {
            firstName: 'Dave',
            lastName: 'Brown',
            email: `${Math.floor(Math.random() * 1321)}dbrown@leblum.com`,
            phone: '303-949-6889',
            password: 'test1234',
        }
        this.supplier = {
            name: `${Math.floor(Math.random() * 1321)}Daves Flowers`,
            slug: `${Math.floor(Math.random() * 1321)}davesFlowers`,
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
            pickupAddress: {
                street1: 'Pickup St St.',
                street2: '#4A',
                city: 'New York',
                state: 'NY',
                zip: '80212',
                type: AddressType.pickup
            },
            pickupPhone: '303-688-8888',
        }
        this.passwordConfirm = 'test1234';
        this.isTermsAgreedTo = true;
    }

    goNext(target: SignupSteps) {
        if (this.isSettingsForm) {
            this.save();
        }
        else {
            if (!this.isStepValid(this.currentSignUpStep)) {
                this.alertService.send({
                    notificationType: NotificationType.validationError,
                    text: 'Please correct the errors on the form.',
                    title: 'Validation Warning'
                });
                return;
            } else {
                this.currentSignUpStep = target;

                if (this.currentSignUpStep === SignupSteps.submitData && !this.hasSubmitted) {
                    this.registerSupplierAndUser();
                    this.hasSubmitted = true;
                }
            }
        }
    }

    save() {
        this.isBusy = true;
        switch (+this.currentFormStyle) {
            case SettingsFormStyle.password:
                if (this.passwordForm.valid) {
                    try {
                        this.userService.changePassword(this.user.password).subscribe(user => {
                            if (!user) {
                                throw ('There was an error saving your password');
                            }
                            this.isBusy = false;
                            // We can close the dialog by calling cancel.... I'm not sure that's exactly what I want to do though.
                            this.cancel();
                        }, error => { this.handleApiError(error); });
                    } catch (err) {
                        this.handleApiError(err);
                    }
                }
                break;
            case SettingsFormStyle.business:
                if (this.companyInfoForm.valid && this.pickupDetailsForm.valid && this.slugForm.valid) {
                    try {
                        console.log('About to update the supplier');
                        this.suppliserService.update(this.supplier, this.supplier._id).map(supplier => {
                            console.log('Supllier Updated moving on to the org.');

                            this.supplier = supplier;
                            this.organization.name = this.supplier.name;

                            return supplier;
                        }).flatMap(supplier => {
                            console.log('About to start org.');

                            return this.organizationService.changeName(this.organization);
                        }).map(org => {
                            console.log('Org Updated now were turning off the busy');
                            this.organization = org;
                            this.isBusy = false;
                        })// Because observables are lazy until there is a subscription, we have to have a subscription at the end of this to actually execute it.
                        .subscribe(() => {
                            console.log('Business Form Settings Saved.');
                            this.cancel();
                        }, error => { this.handleApiError(error); });
                    } catch (err) {
                        this.handleApiError(err);
                    }
                }
                break;
            case SettingsFormStyle.user:
                if (this.emailForm.valid && this.nameForm.valid && this.phoneForm.valid) {
                    try {
                        console.log(this.user._id);
                        this.userService.update(this.user, this.user._id).subscribe(user => {
                            this.user = user;
                            this.isBusy = false;
                            this.cancel();
                        }, error => { this.handleApiError(error); });
                    } catch (err) {
                        this.handleApiError(err);
                    }
                }
                break;
        }
    }

    cancel() {
        this.settingsEventBus.cancel();
    }

    handleApiError(error) {
        this.isBusy = false;
        this.errorEventBus.throw(error);
    }

    registerSupplierAndUser() {
        // Here we're finally ready to submit this data back to the api
        // First we're going to create a user.
        try {
            this.isBusy = true;
            this.suppliserService.createNewSupplierTeam(this.supplier, this.user).subscribe(authResponse => {
                this.isBusy = false;
                // this.alertService.send({
                //     notificationType: NotificationType.success,
                //     text: 'Registration was successful.',
                // });
                console.log('Sending to home after successfull registration.')
                this.router.navigate(["/home"]);
            }, error => {
                this.handleApiError(error);
                this.goBack();
            });
        }
        catch (err) {
            this.isBusy = false;
            this.errorEventBus.throw(err);
            this.goBack();
        }
    }
}
