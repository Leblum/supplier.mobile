import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { BrowseComponent } from "./browse/browse.component";
import { FeaturedComponent } from "./featured/featured.component";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { SettingsTabComponent } from "./settings/settings-tab.component";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";
import { SharedModule } from "../../app/shared/shared.module";

@NgModule({
    imports: [
        NativeScriptModule,
        TabsRoutingModule,
        SharedModule
    ],
    declarations: [
        TabsComponent,
        HomeComponent,
        BrowseComponent,
        SearchComponent,
        FeaturedComponent,
        SettingsTabComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TabsModule { }
