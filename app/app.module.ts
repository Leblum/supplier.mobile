import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "../app/pages/login/login.component";
import { ForgotPasswordComponent } from "../app/pages/forgot-password/forgot-password.component";
import { SupplierService, UserService, AlertService } from "../app/services";
import { AlertComponent } from "../app/directives/alert.component";
import { ErrorEventBus } from "../app/event-buses/error.event-bus";
import { AuthGuard } from "../app/guards/auth.gaurd";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../app/shared/shared.module";
import { SignupModule } from "../app/pages/signup/signup.module";
import { TabsModule } from "../app/tabs/tabs.module";
import { SettingsEventBus } from "../app/event-buses/settings.event-bus";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        AlertComponent
    ],
    providers: [
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
        UserService,
        SupplierService,
        AlertService,
        ErrorEventBus,
        AuthGuard,
        SettingsEventBus
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
