import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "../app/pages/login/login.component";
import { ForgotPasswordComponent } from "../app/pages/forgot-password/forgot-password.component";
import { AuthGuard } from "../app/guards/auth.gaurd";

const routes: Routes = [
    // For testing we're going to head to forgot password first.
    //{ path: "", component: LoginComponent },
    { path: "", loadChildren: "./pages/signup/signup.module#SignupModule" },
    { path: "login", component: LoginComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "home", loadChildren: "./tabs/tabs.module#TabsModule", canActivate: [AuthGuard]  },
    { path: "signup", loadChildren: "./pages/signup/signup.module#SignupModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
