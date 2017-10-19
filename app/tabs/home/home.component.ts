import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../../app/services";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    constructor(private router: Router, private userService: UserService) {
        /* ***********************************************************
        * Use the constructor to inject services.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for the view.
        *************************************************************/
    }

    logout(){
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}
