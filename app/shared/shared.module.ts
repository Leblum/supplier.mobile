import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {NativeScriptFormsModule} from "nativescript-angular/forms"

import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from "../../app/shared/settings/settings.component";

@NgModule({
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        SettingsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers:[],
    exports:[
        SettingsComponent
    ]
})
export class SharedModule { }
