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
    }

    public logout() {
        this.account.logout().subscribe(() => this.router.navigate([""]).then());
    }
}
