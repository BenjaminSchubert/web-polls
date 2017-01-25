import { Component, ViewEncapsulation } from "@angular/core";
import { AccountService } from "./auth/account.service";
import { Router } from "@angular/router";


/**
 * Main component for the application
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "wp-app",
    templateUrl: "webpolls.html",
})
export class WebpollsComponent {
    constructor(private router: Router, public account: AccountService) {}

    public login() {
        this.account.requestLogin();
        // tslint:disable-next-line:no-unused-expression
        this.router; // this is required for Augury to work in debug mode
    }

    public logout() {
        this.account.logout().subscribe();
    }
}
