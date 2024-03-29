import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {NativeScriptFormsModule} from "nativescript-angular/forms"

import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierService, UserService } from "../../../app/services";
import { SharedModule } from "../../../app/shared/shared.module";


@NgModule({
    imports: [
        NativeScriptModule,
        SignupRoutingModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        SignupComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers:[]
})
export class SignupModule { }
