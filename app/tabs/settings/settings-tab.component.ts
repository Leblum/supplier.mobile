import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../../app/services";
import { Router } from "@angular/router";
import * as enums from '../../enumerations';
import { SettingsEventBus } from "../../../app/event-buses/settings.event-bus";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings-tab.component.html",
    styleUrls: ["../tabs.component.css"]
})
export class SettingsTabComponent implements OnInit {
    public isEdit: boolean = false;

    public settingsFormStyles = enums.SettingsFormStyle;
    public currentFormStyle:enums.SettingsFormStyle; 
 
    constructor(private router: Router, private userService: UserService, private settingsEventBus: SettingsEventBus) {
    }

    ngOnInit(): void {
        this.settingsEventBus.cancelEvent$.subscribe(event =>{
            this.isEdit = false;
        })
    }

    logout(){
        this.userService.logout();
        this.router.navigate(['/login']);
    }

    changeBusinessInfo(){
        this.currentFormStyle = enums.SettingsFormStyle.business;
        this.isEdit = true;
    }

    changeUserInfo(){
        this.currentFormStyle = enums.SettingsFormStyle.user;
        this.isEdit = true;
    }

    changePassword(){
        this.currentFormStyle = enums.SettingsFormStyle.password;
        this.isEdit = true;
    }
}
