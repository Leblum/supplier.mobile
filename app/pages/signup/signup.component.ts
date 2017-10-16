import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, Input } from "@angular/core";
import { isAndroid } from "platform";
import { Page } from "ui/page";
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { IUser } from "../../../app/models/index";
import { SignupSteps, AddressType, NotificationType } from "../../../app/enumerations";
import { Router } from "@angular/router";
import { UserService } from "../../../app/services/user.service";
import { ISupplier } from "../../../app/models/supplier.interface";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TextField } from 'ui/text-field'
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import * as utilityModule from 'utils/utils';
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { IAuthenticationResponse } from "../../../app/models/authentication.interface";
import { SupplierService, AlertService } from "../../../app/services";
import { ErrorEventBus } from "../../../app/event-buses/error.event-bus";

@Component({
    selector: "SignupComponent",
    moduleId: module.id,
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit{
    ngOnInit(): void {
    }
}
