import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {NativeScriptFormsModule} from "nativescript-angular/forms"

import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup-routing.module";
import { UserService } from "../../../app/services/user.service";

@NgModule({
    imports: [
        NativeScriptModule,
        SignupRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        SignupComponent,
        //HomeComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers:[
        UserService
    ]
})
export class SignupModule { }